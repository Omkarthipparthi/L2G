# Support Setup Guide for Leet2Git

This guide will help you set up support channels for your Chrome extension as required by the Chrome Web Store.

## ⚠️ Why Support is Required

Chrome Web Store **requires** developers to provide:
1. ✅ A support email address
2. ✅ A way for users to contact you
3. ✅ Timely responses to user issues

**Failure to provide support can result in:**
- Extension rejection during review
- Removal from Chrome Web Store
- Negative reviews from frustrated users

---

## 📧 Option 1: Dedicated Support Email (Recommended)

### Create a Professional Support Email

**Best Practices:**
- Use a dedicated email for extension support
- Make it easy to remember
- Include your extension name

**Good Examples:**
```
support@yourdomain.com
leet2git@yourdomain.com
help.leet2git@gmail.com
leet2git.support@gmail.com
```

**Bad Examples:**
```
yourpersonalemail@gmail.com (looks unprofessional)
randomname123@hotmail.com (not memorable)
```

### Setup Methods

#### Method A: Gmail (Free, Easy)

1. **Create Gmail Account:**
   - Go to https://accounts.google.com/signup
   - Username: `leet2git.support` or similar
   - Complete setup

2. **Configure:**
   - Enable 2FA for security
   - Set up filters to organize extension emails
   - Create canned responses for common issues
   - Set up email forwarding to your personal email (optional)

3. **Test:**
   - Send yourself a test email
   - Verify you can receive and respond

**Gmail Forwarding Setup (Optional):**
```
Settings → Forwarding and POP/IMAP → Add forwarding address
→ Enter your personal email → Verify
```

#### Method B: Custom Domain Email (Professional)

If you own a domain:

1. **Set up email hosting:**
   - Google Workspace ($6/month)
   - Zoho Mail (Free tier available)
   - Microsoft 365 ($5/month)
   - ProtonMail (Privacy-focused)

2. **Create support alias:**
   ```
   support@yourdomain.com
   leet2git@yourdomain.com
   ```

3. **Forward to your main email or dedicated inbox**

#### Method C: Email Forwarding Service

Use services like:
- **ImprovMX** (Free) - Forward custom domain emails to Gmail
- **ForwardEmail** (Free/Paid) - Email forwarding
- **Mailgun** (Free tier) - Developer email service

---

## 📋 Option 2: GitHub Issues (Supplement, Not Replacement)

**Important:** GitHub Issues alone is NOT sufficient for Chrome Web Store.

However, you should enable it as an additional support channel:

### Setup GitHub Issues

1. **Enable Issues:**
   - Go to your repository Settings
   - Check "Issues" is enabled

2. **Create Issue Templates:**

Create `.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug Report
about: Report a problem with Leet2Git
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Chrome Version: [e.g. 120.0]
- Extension Version: [e.g. 1.0.0]
- OS: [e.g. Windows 11]

**Additional context**
Any other relevant information.
```

Create `.github/ISSUE_TEMPLATE/feature_request.md`:
```markdown
---
name: Feature Request
about: Suggest a feature for Leet2Git
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other relevant information.
```

3. **Add SUPPORT.md to repository:**
```markdown
# Getting Help with Leet2Git

## 📧 Email Support (Fastest)
For bugs, issues, or questions, email: **support@yourdomain.com**

We typically respond within 24-48 hours.

## 🐛 Report a Bug
Open an issue: [GitHub Issues](https://github.com/yourusername/leet2git/issues)

## 📖 Documentation
- [README](./README.md)
- [Privacy Policy](./PRIVACY_POLICY.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

## 💬 Common Issues
See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for solutions to common problems.
```

---

## 🌐 Option 3: Support Website/Page (Optional but Professional)

### Create Simple Support Page

You can use:
- GitHub Pages (free)
- Google Sites (free)
- Notion (free)
- Carrd (free/paid)

**Example Support Page Content:**

```markdown
# Leet2Git Support

## Contact Us
📧 Email: support@yourdomain.com
🐛 GitHub Issues: [github.com/username/leet2git/issues](url)

## Response Times
- Bug reports: 24-48 hours
- Feature requests: 1 week
- General questions: 48-72 hours

## Before Contacting Support

### Common Issues
1. **Extension not detecting submissions**
   - Reload LeetCode page
   - Check extension is enabled
   - Try submitting again

2. **GitHub sync fails**
   - Verify token has 'repo' permissions
   - Check repository exists
   - Disconnect and reconnect GitHub

3. **Extension not loading**
   - Update Chrome to latest version
   - Disable conflicting extensions
   - Reinstall extension

### Documentation
- [Privacy Policy](link)
- [Terms of Service](link)
- [Security Policy](link)
- [FAQ](link)

## Report a Bug

When reporting bugs, please include:
- Chrome version
- Extension version
- Steps to reproduce
- Screenshots (if applicable)
- Console errors (press F12 → Console tab)

## Feature Requests
We love hearing your ideas! Email us or open a GitHub issue.

## Security Vulnerabilities
For security issues, email: security@yourdomain.com
See our [Security Policy](link) for details.
```

---

## 📝 Update All Documents with Contact Info

### Files to Update

Replace placeholder emails in:

1. **PRIVACY_POLICY.md**
  - Search for: placeholder emails
  - Replace with: `omkarthipparthi@gmail.com` or your support email

2. **TERMS_OF_SERVICE.md**
   - Same replacement

3. **SECURITY.md**
   - Main contact: `support@yourdomain.com`
   - Security contact: `security@yourdomain.com` (can be same)

4. **DATA_USAGE.md**
   - Same replacement

5. **CHROME_WEB_STORE_LISTING.md**
   - Update support email in listing content

6. **README.md**
   - Add support section if not present

7. **manifest.json** (via Chrome Web Store dashboard)
   - Will add during submission

### Quick Find & Replace

```bash
# For Unix/Linux/Mac
find . -type f -name "*.md" -exec sed -i '' 's/\[your-email@example\.com\]/support@yourdomain.com/g' {} +

# For checking what will change (dry run)
grep -r "\[your-email@example.com\]" *.md
```

**Or manually:** Use your IDE's "Find in Files" feature (Ctrl+Shift+F in most editors)

---

## 🔔 Set Up Email Notifications

### Gmail Setup

1. **Mobile App:**
   - Install Gmail app
   - Turn on notifications for support email
   - Mark as "Priority"

2. **Desktop:**
   - Use email client (Thunderbird, Outlook, etc.)
   - Set up desktop notifications
   - Check multiple times per day

3. **Filters:**
   - Create filter for "Leet2Git" in subject
   - Label as "Extension Support"
   - Mark as important
   - Forward to personal email if needed

### Response Templates

Create **saved replies** in Gmail for common issues:

**Template 1: Thank you for reporting**
```
Subject: Re: [Issue with Leet2Git]

Hi [Name],

Thank you for reporting this issue. I'm looking into it and will get back to you within 24-48 hours.

In the meantime, please try:
1. [Common solution 1]
2. [Common solution 2]

If these don't work, I'll investigate further.

Best regards,
[Your Name]
Leet2Git Support
```

**Template 2: Issue Resolved**
```
Subject: Re: [Issue Resolved]

Hi [Name],

Great news! This issue has been fixed in version X.X.X.

Please update your extension:
1. Go to chrome://extensions/
2. Enable "Developer mode"
3. Click "Update"

Or reinstall from Chrome Web Store.

Let me know if you have any other issues!

Best regards,
[Your Name]
Leet2Git Support
```

**Template 3: Need More Info**
```
Subject: Re: [Need more information]

Hi [Name],

Thank you for reaching out. To help resolve your issue, I need:
1. Your Chrome version (chrome://version/)
2. Extension version (chrome://extensions/)
3. Steps to reproduce the issue
4. Any error messages (F12 → Console)
5. Screenshot (if applicable)

Reply with this info and I'll investigate right away.

Best regards,
[Your Name]
Leet2Git Support
```

---

## 📊 Support Tracking

### Simple Spreadsheet Tracking

Create a Google Sheet to track support requests:

| Date | User Email | Issue Type | Status | Resolution | Response Time |
|------|------------|------------|--------|------------|---------------|
| 10/26 | user@... | Bug | Open | - | - |
| 10/25 | user2@... | Feature | Closed | Implemented | 3 days |

**Issue Types:**
- Bug
- Feature Request
- Question
- GitHub Connection
- Sync Issue
- Other

**Statuses:**
- Open
- In Progress
- Waiting for User
- Resolved
- Closed

---

## ⏱️ Response Time Commitments

### Recommended Response Times

| Issue Type | First Response | Resolution |
|-----------|----------------|------------|
| Critical Bug | 24 hours | 1-3 days |
| Bug | 48 hours | 3-7 days |
| Feature Request | 1 week | Varies |
| Question | 48-72 hours | Same day |
| Security Issue | 12 hours | 1-2 days |

### Set Clear Expectations

In your support docs, state:
```markdown
## Response Times
- We aim to respond to all emails within 48 hours
- Critical issues are prioritized
- Feature requests may take longer to implement
- We're a small team, thanks for your patience!
```

---

## 🚨 Handling Negative Reviews

### When You Get a Bad Review

1. **Respond Professionally:**
   ```
   "Thank you for your feedback. I'm sorry you experienced this issue. 
   Please email support@... so I can help resolve this immediately."
   ```

2. **Fix the Issue:**
   - Investigate and fix
   - Release update
   - Follow up with user

3. **Ask for Update:**
   ```
   "Hi [User], I've released v1.0.1 which fixes this issue. 
   Would you mind updating your review if it's working now? Thanks!"
   ```

### Prevent Negative Reviews

- Respond quickly to support emails
- Fix bugs promptly
- Be transparent about limitations
- Under-promise, over-deliver

---

## 📞 Chrome Web Store Requirements

### What Chrome Web Store Checks

1. ✅ **Support Email Listed:** In developer dashboard
2. ✅ **Email is Valid:** They may test it
3. ✅ **Responsive:** You must respond to reports
4. ✅ **Privacy Policy Link:** Must include contact info

### Where to Add Support Email

During submission:
1. **Developer Dashboard → Item → Store Listing**
2. **Support Section:**
   - Support URL: `https://github.com/username/leet2git/issues`
   - Support Email: `support@yourdomain.com` (REQUIRED)

---

## ✅ Support Setup Checklist

### Immediate Actions (Before Submission)
- [ ] Create support email account
- [ ] Test email works (send/receive)
- [ ] Update all documentation with real email
- [x] Email placeholders already updated to omkarthipparthi@gmail.com
- [ ] Set up email forwarding/notifications
- [ ] Create response templates

### Optional But Recommended
- [ ] Enable GitHub Issues
- [ ] Create issue templates
- [ ] Add SUPPORT.md to repository
- [ ] Create support page/website
- [ ] Set up tracking spreadsheet
- [ ] Create canned responses in Gmail

### During Submission
- [ ] Add support email to Chrome Web Store listing
- [ ] Add support URL (GitHub Issues)
- [ ] Verify email in submission form

### After Launch
- [ ] Monitor email daily
- [ ] Respond within 48 hours
- [ ] Track and resolve issues
- [ ] Update extension based on feedback

---

## 💡 Pro Tips

### Be Proactive
- Monitor Chrome Web Store reviews daily
- Check GitHub Issues regularly
- Search Twitter/Reddit for mentions
- Ask for feedback proactively

### Be Transparent
- Acknowledge bugs publicly
- Share roadmap with users
- Explain limitations honestly
- Thank users for feedback

### Be Responsive
- Set up mobile notifications
- Check email multiple times per day
- Respond even if you don't have a fix yet
- Follow up after fixing issues

### Build Community
- Encourage GitHub contributions
- Respond to all reviews (good and bad)
- Share updates on social media
- Create a Discord/Slack (optional)

---

## 📧 Example Support Email Addresses

### If You Own a Domain
```
support@yourdomain.com
help@yourdomain.com
leet2git@yourdomain.com
contact@yourdomain.com
```

### Using Gmail
```
leet2git.support@gmail.com
leet2git.help@gmail.com
leet2git.contact@gmail.com
yourusername.leet2git@gmail.com
```

### Using Outlook/Hotmail
```
leet2git@outlook.com
leet2git.support@outlook.com
```

**Pick ONE and use it consistently everywhere.**

---

## 🔒 Security & Privacy

### Protect User Privacy
- Don't share user emails publicly
- Don't include personal info in GitHub Issues
- Use secure email providers
- Enable 2FA on support email

### Handle Sensitive Reports
For security vulnerabilities:
- Separate email: `security@yourdomain.com`
- Respond within 24 hours
- Don't disclose publicly until fixed
- Thank researchers in security advisory

---

## 📈 Long-Term Support Strategy

### First Month
- Respond to every email personally
- Fix critical bugs immediately
- Build trust with early users
- Learn common issues

### After First Month
- Create FAQ based on common questions
- Write troubleshooting guides
- Improve documentation
- Automate common responses

### Ongoing
- Regular extension updates
- Respond to 90%+ of emails
- Maintain positive ratings
- Build loyal user base

---

## ✅ Quick Setup (15 Minutes)

1. **Create Gmail** (5 min)
   - Go to Gmail
   - Create `leet2git.support@gmail.com`
   - Enable 2FA

2. **Update Docs** (5 min)
   - Email already set to omkarthipparthi@gmail.com
   - With your new support email
   - In all .md files

3. **Test** (2 min)
   - Send test email to yourself
   - Verify you can receive/respond

4. **Setup Notifications** (3 min)
   - Install Gmail app
   - Enable push notifications
   - Set as priority inbox

**Done!** You now have a professional support system.

---

## 📞 Need Help?

If you need help setting up support:
- Check Gmail Help Center
- Watch YouTube tutorials on professional email setup
- Ask on developer forums

---

**Last Updated:** October 26, 2025

**Setup Time:** 15-30 minutes  
**Cost:** Free (using Gmail)  
**Requirement:** Mandatory for Chrome Web Store

