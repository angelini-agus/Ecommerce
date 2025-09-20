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

// Realtime validation with enhanced messages
const validators = {
  username: v => {
    if (!v.trim()) return "El usuario es obligatorio";
    if (v.trim().length < 3) return "Mínimo 3 caracteres";
    if (!/^[a-zA-Z0-9_]+$/.test(v.trim())) return "Solo letras, números y guiones bajos";
    return true;
  },
  email: v => {
    if (!v) return "El email es obligatorio";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Formato de email inválido";
    return true;
  },
  password: v => {
    if (!v) return "La contraseña es obligatoria";
    if (v.length < 6) return "Mínimo 6 caracteres";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v)) return "Debe incluir mayúscula, minúscula y número";
    return true;
  },
  confirm: (v, form) => {
    if (!v) return "Confirma tu contraseña";
    if (v !== form.password.value) return "Las contraseñas no coinciden";
    return true;
  },
  tel: v => {
    if (!v) return "El teléfono es obligatorio";
    if (!/^\+?\d{7,15}$/.test(v)) return "Formato de teléfono inválido (ej: +54912345678)";
    return true;
  },
  birth: v => {
    if (!v) return "La fecha de nacimiento es obligatoria";
    const birthDate = new Date(v);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) return "Debes tener al menos 13 años";
    if (age > 120) return "Fecha de nacimiento inválida";
    return true;
  },
  country: v => true, // Any selection is valid
  terms: v => v === true || "Debes aceptar los términos y condiciones",
  newsletter: v => (v === "si" || v === "no") || "Elige si deseas recibir el newsletter"
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
    const formGroup = input.closest('.form-group');
    const feedback = formGroup.querySelector('.feedback');
    const icon = formGroup.querySelector('.status-icon');

    // Handle different input types
    const targetInput = input.type === 'radio' ? formGroup.querySelector('input[type="radio"]:last-of-type') : input;

    targetInput.classList.remove('error', 'success', 'warning');
    feedback.className = "feedback";
    feedback.innerHTML = "";

    if (ok) {
      targetInput.classList.add('success');
      feedback.classList.add('success');
      if (icon) {
        icon.innerHTML = '✓';
        icon.className = 'status-icon success';
      }
    } else if (msg) {
      // Determine severity based on message content
      let severity = 'warning';
      if (msg.includes('obligatorio') || msg.includes('inválido') || msg.includes('coinciden') || msg.includes('aceptar')) {
        severity = 'error';
      }

      targetInput.classList.add(severity);
      feedback.classList.add(severity);
      if (icon) {
        icon.innerHTML = severity === 'error' ? '✕' : '⚠';
        icon.className = `status-icon ${severity}`;
      }
      feedback.innerHTML = `<span class="feedback-text">${msg}</span>`;
    } else {
      if (icon) {
        icon.innerHTML = '';
        icon.className = 'status-icon';
      }
    }
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
  ['username','email','password','confirm','tel','birth'].forEach(n=>{
    fields[n]?.addEventListener('input', () => validateField(n));
  });

  // Handle select elements with 'change' event
  fields.country?.addEventListener('change', () => validateField('country'));

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
      // Simulate API call with delay
      submitBtn.textContent = "Procesando...";

      const res = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token-12345'
        },
        body: JSON.stringify({
          ...payload,
          registrationDate: new Date().toISOString(),
          status: 'pending_verification'
        })
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const data = await res.json();

      // Enhanced success feedback
      const successMsg = document.createElement('div');
      successMsg.className = 'form-message success-message';
      successMsg.innerHTML = `
        <div class="message-content">
          <span class="message-icon">✅</span>
          <div class="message-text">
            <strong>¡Registro exitoso!</strong><br>
            <small>Tu cuenta ha sido creada con ID: ${data.id}</small>
          </div>
        </div>
      `;

      form.appendChild(successMsg);

      // Scroll to the message
      setTimeout(() => {
        successMsg.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);

      // Reset form and clear states
      form.reset();
      $all('input,select', form).forEach(i => {
        i.classList.remove('error','success','warning');
        const icon = i.closest('.form-group').querySelector('.status-icon');
        if (icon) {
          icon.innerHTML = '';
          icon.className = 'status-icon';
        }
        const feedback = i.closest('.form-group').querySelector('.feedback');
        if (feedback) feedback.innerHTML = '';
      });

      // Remove success message after 5 seconds
      setTimeout(() => {
        if (successMsg.parentNode) {
          successMsg.remove();
        }
      }, 5000);

    }catch(err){
      // Enhanced error feedback
      const errorMsg = document.createElement('div');
      errorMsg.className = 'form-message error-message';
      errorMsg.innerHTML = `
        <div class="message-content">
          <span class="message-icon">❌</span>
          <div class="message-text">
            <strong>Error en el registro</strong><br>
            <small>${err.message}</small>
          </div>
        </div>
      `;

      form.appendChild(errorMsg);

      // Scroll to the message
      setTimeout(() => {
        errorMsg.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);

      // Remove error message after 4 seconds
      setTimeout(() => {
        if (errorMsg.parentNode) {
          errorMsg.remove();
        }
      }, 4000);
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
  const regForm = document.getElementById('RegForm');

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

  // Initialize form validation
  if (regForm) {
    attachValidation(regForm);
  }
});
