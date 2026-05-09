const jwt = require("jsonwebtoken");

exports.generateSignature = (req, res) => {
  const { meetingNumber, role } = req.body;

  if (!meetingNumber) {
    return res.status(400).json({ success: false, message: "meetingNumber is required" });
  }

  try {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2; // Token expires in 2 hours

    const payload = {
      sdkKey: process.env.SDK_ID,
      appKey: process.env.SDK_ID, // Required for Meeting SDK
      mn: meetingNumber,
      role: parseInt(role, 10), // 0 for participant, 1 for host
      iat: iat,
      exp: exp,
      tokenExp: exp
    };

    const signature = jwt.sign(payload, process.env.SDK_SECRET, {
      algorithm: 'HS256',
      header: { alg: 'HS256', typ: 'JWT' }
    });

    res.json({
      success: true,
      signature: signature,
      sdkKey: process.env.SDK_ID
    });
  } catch (error) {
    console.error("Signature Generation Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate signature" });
  }
};
