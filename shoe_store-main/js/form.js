function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

const LoginForm = document.getElementById("LoginForm");
const RegForm = document.getElementById("RegForm");
const Indicator = document.getElementById("Indicator");

function register(){
  RegForm.style.transform = "translateX(0)";
  LoginForm.style.transform = "translateX(300px)";
  Indicator.style.transform = "translateX(100px)";
}
function login(){
  RegForm.style.transform = "translateX(-300px)";
  LoginForm.style.transform = "translateX(0)";
  Indicator.style.transform = "translateX(0)";
}
window.register = register;
window.login = login;

// Realtime validation
const validators = {
  username: v => v.trim().length >= 3 || "Mínimo 3 caracteres",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email inválido",
  password: v => v.length >= 6 || "Mínimo 6 caracteres",
  confirm: (v, form) => v === form.password.value || "Las contraseñas no coinciden",
  tel: v => /^\+?\d{7,15}$/.test(v) || "Teléfono inválido",
  birth: v => !!v || "Fecha requerida",
  country: v => !!v || "Seleccione un país",
  terms: v => v === true || "Aceptá los términos",
  newsletter: v => (v === "si" || v === "no") || "Elegí una opción"
};

function attachValidation(form){
  const fields = {
    username: form.querySelector('[name="username"]'),
    email: form.querySelector('[name="email"]'),
    password: form.querySelector('[name="password"]'),
    confirm: form.querySelector('[name="confirm"]'),
    tel: form.querySelector('[name="tel"]'),
    birth: form.querySelector('[name="birth"]'),
    country: form.querySelector('[name="country"]'),
    terms: form.querySelector('[name="terms"]'),
    newsletter: form.querySelectorAll('[name="newsletter"]')
  };
  function setState(input, ok, msg){
    const feedback = input.closest('.form-group').querySelector('.feedback');
    input.classList.toggle('error', !ok);
    input.classList.toggle('success', ok);
    feedback.textContent = ok ? "" : msg;
    feedback.className = "feedback " + (ok ? "success" : "error");
  }
  function getNewsletterValue(){
    const checked = Array.from(fields.newsletter).find(r => r.checked);
    return checked ? checked.value : "";
  }
  function validateField(name){
    let value;
    if (name === 'terms') value = fields.terms.checked;
    else if (name === 'newsletter') value = getNewsletterValue();
    else value = fields[name].value;
    const rule = validators[name];
    const res = rule(value, form);
    const ok = res === true || res === undefined;
    const msg = ok ? "" : res;
    if (name === 'newsletter') {
      // use the last radio to show feedback
      const last = fields.newsletter[fields.newsletter.length-1];
      setState(last, ok, msg);
    } else {
      setState(fields[name], ok, msg);
    }
    return ok;
  }
  // attach listeners
  ['username','email','password','confirm','tel','birth','country'].forEach(n=>{
    fields[n]?.addEventListener('input', () => validateField(n));
  });
  fields.terms?.addEventListener('change', () => validateField('terms'));
  fields.newsletter.forEach(r => r.addEventListener('change', () => validateField('newsletter')));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const allOk = ['username','email','password','confirm','tel','birth','country','terms','newsletter'].every(validateField);
    if(!allOk) return;

    const payload = {
      username: fields.username.value.trim(),
      email: fields.email.value.trim(),
      tel: fields.tel.value.trim(),
      birth: fields.birth.value,
      country: fields.country.value,
      newsletter: getNewsletterValue()
    };
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    try{
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error en la simulación de envío');
      const data = await res.json();
      // Show success
      alert('Formulario enviado ✅ (simulado). ID: ' + data.id);
      form.reset();
      // clear states
      $all('input,select', form).forEach(i=> { i.classList.remove('error','success'); });
    }catch(err){
      alert('No se pudo enviar: ' + err.message);
    }finally{
      submitBtn.disabled = false;
      submitBtn.textContent = "Registrarme";
    }
  });
}

// Attach on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const formContainer = document.querySelector('.form-container');
  const loginBtn = document.querySelector('.form-btn span:nth-child(1)');
  const registerBtn = document.querySelector('.form-btn span:nth-child(2)');

  // Mostrar login por defecto
  formContainer.classList.remove('register-active');

  window.login = function() {
    formContainer.classList.remove('register-active');
  };
  window.register = function() {
    formContainer.classList.add('register-active');
  };

  // Opcional: listeners para accesibilidad
  loginBtn.addEventListener('click', window.login);
  registerBtn.addEventListener('click', window.register);
});
