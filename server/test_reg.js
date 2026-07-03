async function testReg() {
  const email = `janvee_${Date.now()}@test.com`;
  console.log('Sending registration request with email:', email);
  try {
    const res = await fetch('http://localhost:5000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({
        fullName: 'Janvee Sahu',
        email: email,
        password: 'Janvee123',
        role: 'TENANT'
      })
    });
    console.log('Response Status:', res.status);
    const data = await res.json();
    console.log('Response Body:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error during fetch:', err);
  }
}

testReg();
