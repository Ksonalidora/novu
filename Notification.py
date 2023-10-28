import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Email configuration
sender_email = 'your_email@gmail.com'
sender_password = 'your_password'
receiver_email = 'recipient@example.com'  # Replace with the recipient's email address
subject = 'Notification Subject'
message = 'This is the content of your email notification.'

# Create a MIMEText object
msg = MIMEMultipart()
msg['From'] = sender_email
msg['To'] = receiver_email
msg['Subject'] = subject
msg.attach(MIMEText(message, 'plain'))

# Connect to the SMTP server (in this case, Gmail)
smtp_server = 'smtp.gmail.com'
smtp_port = 587

with smtplib.SMTP(smtp_server, smtp_port) as server:
    server.starttls()
    server.login(sender_email, sender_password)
    server.sendmail(sender_email, receiver_email, msg.as_string())

print('Email notification sent successfully')
