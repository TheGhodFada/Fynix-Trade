<?php
// --- SETTINGS ---
$to = "ghodfada15@gmail.com";  // 🔹 Replace this with your real email
$subject = "New Contact Message from FynixTrade";

// --- GET FORM INPUTS SAFELY ---
$name = htmlspecialchars(trim($_POST['name']));
$email = htmlspecialchars(trim($_POST['email']));
$message = htmlspecialchars(trim($_POST['message']));

// --- VALIDATION ---
if (empty($name) || empty($email) || empty($message)) {
  echo "<script>alert('Please fill in all fields.'); window.history.back();</script>";
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo "<script>alert('Please enter a valid email.'); window.history.back();</script>";
  exit;
}

// --- EMAIL BODY ---
$body = "
  <h2>New Message from FynixTrade Contact Form</h2>
  <p><strong>Name:</strong> {$name}</p>
  <p><strong>Email:</strong> {$email}</p>
  <p><strong>Message:</strong><br>{$message}</p>
  <hr>
  <small>Sent on " . date('Y-m-d H:i:s') . "</small>
";

// --- EMAIL HEADERS ---
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: {$name} <{$email}>" . "\r\n";

// --- SEND MAIL ---
if (mail($to, $subject, $body, $headers)) {
  echo "<script>alert('✅ Message sent successfully!'); window.location.href='contact.html';</script>";
} else {
  echo "<script>alert('❌ There was an error sending your message. Please try again.'); window.history.back();</script>";
}
?>
