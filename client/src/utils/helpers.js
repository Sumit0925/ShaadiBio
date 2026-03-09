export function calculateAge(dob) {
  if (!dob) return "";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age > 0 ? String(age) : "";
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^[+]?[\d\s\-()]{7,15}$/.test(phone);
}

export function validateBiodata(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = "Full name is required";
  if (!data.gender) errors.gender = "Gender is required";
  if (!data.dob) errors.dob = "Date of birth is required";
  if (!data.religion) errors.religion = "Religion is required";
  if (data.contactEmail && !isValidEmail(data.contactEmail))
    errors.contactEmail = "Invalid email address";
  if (data.phone && !isValidPhone(data.phone))
    errors.phone = "Invalid phone number";
  return errors;
}

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email?.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Invalid email address";
  if (!password?.trim()) errors.password = "Password is required";
  return errors;
}

export function validateRegister({ name, email, password }) {
  const errors = {};
  if (!name?.trim()) errors.name = "Name is required";
  if (!email?.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Invalid email address";
  if (!password?.trim()) errors.password = "Password is required";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters";
  return errors;
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
