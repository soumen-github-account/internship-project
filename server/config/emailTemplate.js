
export const welcomeEmailTemplate = ({
  websiteName,
  websiteLogo,
  userName,
  loginUrl,
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Welcome to ${websiteName}</title>
</head>

<body style="margin:0; background:#f3f4f6; font-family:Arial, sans-serif;">

<!-- NAVBAR -->
<table width="100%" style="background:#111827; padding:16px;">
  <tr>
    <td align="center">
      <img src="${websiteLogo}" height="40" alt="${websiteName}" />
    </td>
  </tr>
</table>

<!-- MAIN -->
<table width="100%">
<tr>
<td align="center" style="padding:24px;">

<table width="600" style="background:#ffffff; border-radius:10px; overflow:hidden;">

<!-- HEADER -->
<tr>
<td style="padding:24px; background:#eef2ff;">
<h2 style="margin:0; color:#1f2937;">
🎉 Welcome to ${websiteName}, ${userName}!
</h2>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:24px; color:#374151;">
<p>Hi <strong>${userName}</strong>,</p>

<p>
Thank you for signing up on <strong>${websiteName}</strong>.
We’re excited to have you on board!
</p>

<p>
You can now explore jobs, apply easily, and get personalized job alerts directly to your inbox.
</p>

</td>
</tr>

<!-- CTA -->
<tr>
<td align="center" style="padding:24px;">
<a href="${loginUrl}"
style="
background:#4f46e5;
color:#ffffff;
padding:14px 32px;
text-decoration:none;
border-radius:999px;
font-weight:bold;
">
Login to Your Account
</a>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="padding:16px; background:#f9fafb; text-align:center;
font-size:12px; color:#6b7280;">
If you did not sign up for ${websiteName}, you can safely ignore this email.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;


export const PASSWORD_RESET_TEMPLATE = `

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Password Reset</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="main-content">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                      <tr>
                        <td style="padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;">
                          Forgot your password?
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          We received a password reset request for your account: <span style="color: #4C83EE;">{{email}}</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;">
                          Use the OTP below to reset the password.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 24px;">
                          <p class="button" >{{otp}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 10px; font-size: 14px; line-height: 150%;">
                          The password reset otp is only valid for the next 15 minutes.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`

export const JOB_POSTED_EMAIL_TEMPLATE = ({
  websiteName,
  websiteLogo,
  jobTitle,
  companyName,
  companyLogo,
  location,
  stipend,
  aboutWork = [],
  skills = [],
  perks = [],
  applyUrl
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>New Job Posted</title>
</head>

<body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">

  <!-- NAVBAR -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111827; padding:16px;">
    <tr>
      <td align="center">
        <img src="${websiteLogo}" alt="${websiteName}" height="40" />
      </td>
    </tr>
  </table>

  <!-- CONTAINER -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:24px;">
        
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- HEADER -->
          <tr>
            <td style="padding:24px; background:#eef2ff;">
              <h2 style="margin:0; color:#1f2937;">
                🚀 New Job Posted by ${companyName}
              </h2>
            </td>
          </tr>

          <!-- JOB CARD -->
          <tr>
            <td style="padding:24px;">
              <table width="100%">
                <tr>
                  <td width="80">
                    <img src="${companyLogo}" alt="Company Logo" width="64" style="border-radius:8px;" />
                  </td>
                  <td>
                    <h3 style="margin:0; color:#111827;">${jobTitle}</h3>
                    <p style="margin:4px 0; color:#6b7280;">📍 ${location}</p>
                    <p style="margin:4px 0; color:#16a34a;"><strong>${stipend}</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ABOUT WORK -->
          ${aboutWork.length ? `
          <tr>
            <td style="padding:0 24px;">
              <h4 style="color:#111827;">About the Work</h4>
              <ul style="color:#374151;">
                ${aboutWork.map(item => `<li>${item}</li>`).join("")}
              </ul>
            </td>
          </tr>` : ""}

          <!-- SKILLS -->
          ${skills.length ? `
          <tr>
            <td style="padding:0 24px;">
              <h4 style="color:#111827;">Skills Required</h4>
              <p style="color:#374151;">${skills.join(", ")}</p>
            </td>
          </tr>` : ""}

          <!-- PERKS -->
          ${perks.length ? `
          <tr>
            <td style="padding:0 24px;">
              <h4 style="color:#111827;">Perks</h4>
              <ul style="color:#374151;">
                ${perks.map(item => `<li>${item}</li>`).join("")}
              </ul>
            </td>
          </tr>` : ""}

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:32px;">
              <a href="${applyUrl}" 
                style="background:#4f46e5; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:999px; font-weight:bold;">
                Apply Now
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:16px; background:#f9fafb; text-align:center; font-size:12px; color:#6b7280;">
              You are receiving this email because you subscribed to job alerts on ${websiteName}.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
