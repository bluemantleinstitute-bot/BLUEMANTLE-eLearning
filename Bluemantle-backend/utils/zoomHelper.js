const axios = require('axios');

/**
 * Zoom Server-to-Server OAuth Helper
 * Requires ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, and ZOOM_CLIENT_SECRET in .env
 */

let zoomAccessToken = null;
let tokenExpiryTime = null;

const getZoomAccessToken = async () => {
    try {
        if (zoomAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime - 300000) {
            return zoomAccessToken;
        }

        const accountId = process.env.ZOOM_ACCOUNT_ID;
        const clientId = process.env.ZOOM_CLIENT_ID;
        const clientSecret = process.env.ZOOM_CLIENT_SECRET;

        if (!accountId || !clientId || !clientSecret) {
            throw new Error("Zoom credentials missing in environment variables.");
        }

        const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;
        const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const response = await axios.post(tokenUrl, {}, {
            headers: { 'Authorization': `Basic ${authHeader}` }
        });

        zoomAccessToken = response.data.access_token;
        tokenExpiryTime = Date.now() + (response.data.expires_in * 1000);

        return zoomAccessToken;
    } catch (error) {
        console.error("Error fetching Zoom access token:", error.response?.data || error.message);
        throw new Error("Failed to get Zoom access token");
    }
};

/**
 * Create a Zoom meeting via API
 * @param {Object} options - { topic, startTime (ISO string), duration (minutes), teacherEmail }
 * @returns {Object} { meetingId, joinUrl, startUrl, password }
 */
exports.createZoomMeeting = async ({ topic, startTime, duration = 60, teacherEmail }) => {
    try {
        const token = await getZoomAccessToken();

        const payload = {
            topic: topic || "Live Class Session",
            type: 2, // Scheduled meeting
            start_time: startTime,
            duration: duration,
            timezone: "Asia/Kolkata",
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: true,
                waiting_room: true,
                auto_recording: "cloud", // Cloud recording ensures it is never lost to local PC crashes
                approval_type: 0,
                registration_type: 1,
                audio: "both",
                allow_multiple_devices: false
            }
        };

        // Use "me" if no email, or specify the teacher's email as the meeting host
        const hostEndpoint = teacherEmail
            ? `https://api.zoom.us/v2/users/${encodeURIComponent(teacherEmail)}/meetings`
            : `https://api.zoom.us/v2/users/me/meetings`;

        let response;
        try {
            response = await axios.post(hostEndpoint, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (initialErr) {
            // If the user does not exist in the Zoom account, fallback to creating it under the master 'me' account
            if (initialErr.response && initialErr.response.data && initialErr.response.data.code === 1001) {
                console.warn(`Zoom user ${teacherEmail} not found. Falling back to master account ('me').`);
                response = await axios.post(`https://api.zoom.us/v2/users/me/meetings`, payload, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                throw initialErr;
            }
        }

        const meeting = response.data;

        return {
            meetingId: meeting.id.toString(),
            joinUrl: meeting.join_url,
            startUrl: meeting.start_url, // Host URL (for teacher/admin)
            password: meeting.password,
        };
    } catch (error) {
        console.error("Error creating Zoom meeting:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create Zoom meeting");
    }
};

/**
 * Get meeting participants and their duration
 * @param {string} meetingId The Zoom Meeting ID
 */
exports.getMeetingParticipants = async (meetingId) => {
    try {
        const token = await getZoomAccessToken();

        const url = `https://api.zoom.us/v2/report/meetings/${meetingId}/participants?page_size=300`;

        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return response.data.participants;
    } catch (error) {
        console.error(`Error fetching participants for meeting ${meetingId}:`, error.response?.data || error.message);
        throw new Error("Failed to fetch meeting participants from Zoom");
    }
};

/**
 * Get cloud recording download links for a completed meeting
 * @param {string} meetingId
 */
exports.getMeetingRecordings = async (meetingId) => {
    try {
        const token = await getZoomAccessToken();

        const url = `https://api.zoom.us/v2/meetings/${meetingId}/recordings`;
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return response.data.recording_files || [];
    } catch (error) {
        console.error(`Error fetching recordings for meeting ${meetingId}:`, error.response?.data || error.message);
        return [];
    }
};
