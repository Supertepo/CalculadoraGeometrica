// Utilidades
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Layout: menú superior (figuras) y sidebar dinámico
const sidebar = document.getElementById('sidebar');

function showFigure(fig) {
  // activar botón superior
  $$('.top-item').forEach((b) => b.classList.toggle('active', b.dataset.figure === fig));
  // mostrar vista correspondiente
  $$('.view').forEach((v) => {
    const match = v.getAttribute('data-figure') === fig;
    v.classList.toggle('show', match);
    v.toggleAttribute('hidden', !match);
  });
  // render sidebar para la figura
  renderSidebar(fig);
}
function renderSidebar(fig) {
  const sidebar = document.getElementById('sidebar'); // Asegúrate de que apuntas al elemento correcto

  // 1. Limpiar el contenido anterior
  sidebar.innerHTML = '';

  if (fig === 'triangulo') {
    // 2. Mostrar la sidebar si es 'triangulo'
    sidebar.style.display = 'block'; // o 'flex', 'grid', etc., dependiendo de tu CSS

    const box = document.createElement('div');
    box.className = 'option';

    const title = document.createElement('h3');
    title.textContent = 'Variantes de triángulo';
    box.appendChild(title);

    const variants = [
      { id: 'equilatero', label: 'Equilátero' },
      { id: 'isoceles', label: 'Isósceles' },
      { id: 'escaleno', label: 'Escaleno' },
    ];

    variants.forEach((v, idx) => {
      const lab = document.createElement('label');
      const rb = document.createElement('input');
      rb.type = 'radio';
      rb.name = 'tri-variant';
      rb.value = v.id;
      if (idx === 0) rb.checked = true; // default equilátero
      // Asegúrate de que la función setTriangleVariant esté definida en tu código
      rb.addEventListener('change', () => setTriangleVariant(v.id)); 
      lab.appendChild(rb);
      lab.appendChild(document.createTextNode(v.label));
      box.appendChild(lab);
    });

    sidebar.appendChild(box);
    // Asegúrate de que la función setTriangleVariant esté definida en tu código
    setTriangleVariant('equilatero'); 

  } else {
    // 3. Ocultar la sidebar si no es 'triangulo'
    sidebar.style.display = 'none';
  }
}

function setTriangleVariant(variant) {
  const form = document.querySelector("form[data-shape='triangulo']");
  if (!form) return;
  $$('.variant', form).forEach((section) => {
    const active = section.getAttribute('data-variant') === variant;
    section.toggleAttribute('hidden', !active);
  });
  // limpiar feedback e inputs inválidos cuando cambia la variante
  const fb = $('.form__feedback', form);
  if (fb) fb.textContent = '';
  $$('input', form).forEach((inp) => inp.classList.remove('is-invalid'));
  form.setAttribute('data-variant', variant);
}

// Validación genérica
function getValue(input) {
  const v = Number(input.value);
  const valid = Number.isFinite(v) && v > 0;
  input.classList.toggle('is-invalid', !valid);
  return valid ? v : null;
}

function setFeedback(el, msg, ok = false) {
  el.textContent = msg;
  el.classList.toggle('error', !ok);
  el.classList.toggle('success', ok);
}

// Cálculos básicos
function perimetroCuadrado(l) { return 4 * l; }
function areaCuadrado(l) { return l * l; }

function perimetroCirculo(r) { return 2 * Math.PI * r; }
function areaCirculo(r) { return Math.PI * r * r; }

// Triángulos
function perimetroTriangulo(a, b, c) { return a + b + c; }
function areaHeron(a, b, c) {
  const s = (a + b + c) / 2;
  const inside = s * (s - a) * (s - b) * (s - c);
  if (inside <= 0) return NaN;
  return Math.sqrt(inside);
}
function areaEquilatero(a) { return (Math.sqrt(3) / 4) * a * a; }
function perimetroEquilatero(a) { return 3 * a; }
function perimetroIsoceles(s, b) { return 2 * s + b; }
function areaIsoceles(s, b) {
  const h2 = s * s - (b / 2) * (b / 2);
  if (h2 <= 0) return NaN;
  return (b * Math.sqrt(h2)) / 2;
}

// Cuerpos
function areaCubo(a) { return 6 * a * a; }
function volumenCubo(a) { return a ** 3; }

function areaEsfera(r) { return 4 * Math.PI * r * r; }
function volumenEsfera(r) { return (4 / 3) * Math.PI * r ** 3; }

function areaCilindro(r, h) { return 2 * Math.PI * r * (h + r); }
function volumenCilindro(r, h) { return Math.PI * r * r * h; }

// Rectángulo
function perimetroRectangulo(a, b) { return 2 * (a + b); }
function areaRectangulo(a, b) { return a * b; }

// Pentágono regular
function perimetroPentagono(a) { return 5 * a; }
// Opción 1 (por apotema): A = (P * ap) / 2
function areaPentagonoPorApotema(a, ap) { return (perimetroPentagono(a) * ap) / 2; }
// Opción 2 (por lado): A = 5a^2 / (4 tan(pi/5))
function areaPentagono(a) { return (5 * a * a) / (4 * Math.tan(Math.PI / 5)); }

// Trapecio (general): área con B, b, h; perímetro con B, b, c, d
function areaTrapecio(B, b, h) { return ((B + b) * h) / 2; }
function perimetroTrapecio(B, b, c, d) { return B + b + c + d; }

// Prisma rectangular
function areaPrisma(l, w, h) { return 2 * (l * w + l * h + w * h); }
function volumenPrisma(l, w, h) { return l * w * h; }

// Cono
function areaCono(r, h) { const g = Math.sqrt(r * r + h * h); return Math.PI * r * (r + g); }
function volumenCono(r, h) { return (Math.PI * r * r * h) / 3; }

// Pirámide base cuadrada
function areaPiramide(a, h) { const g = Math.sqrt((a / 2) ** 2 + h * h); return a * a + 2 * a * g; }
function volumenPiramide(a, h) { return (a * a * h) / 3; }

// Manejo de formularios y acciones
$$('form.form').forEach((form) => {
  const feedback = $('.form__feedback', form);
  const shape = form.getAttribute('data-shape');

  // Quitar estado de error al escribir
  $$('input', form).forEach((inp) => {
    inp.addEventListener('input', () => inp.classList.remove('is-invalid'));
  });

  $$('.form__actions button', form).forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      let result = null;

      try {
        switch (shape) {
          case 'cuadrado': {
            const l = getValue(form.lado);
            if (!l) return setFeedback(feedback, 'Ingresa un lado válido.');
            result = action === 'perimetro' ? perimetroCuadrado(l) : areaCuadrado(l);
            break;
          }
          case 'circulo': {
            const r = getValue(form.radio);
            if (!r) return setFeedback(feedback, 'Ingresa un radio válido.');
            result = action === 'perimetro' ? perimetroCirculo(r) : areaCirculo(r);
            break;
          }
          case 'rectangulo': {
            const a = getValue(form.ancho);
            const b = getValue(form.alto);
            if (!a || !b) return setFeedback(feedback, 'Ingresa ancho y alto válidos.');
            result = action === 'perimetro' ? perimetroRectangulo(a, b) : areaRectangulo(a, b);
            break;
          }
          case 'triangulo': {
            const variant = form.getAttribute('data-variant') || 'equilatero';
            if (variant === 'equilatero') {
              const a = getValue(form.ladoEqui);
              if (!a) return setFeedback(feedback, 'Ingresa un lado válido.');
              result = action === 'perimetro' ? perimetroEquilatero(a) : areaEquilatero(a);
            } else if (variant === 'isoceles') {
              const s = getValue(form.ladoIgual);
              const b = getValue(form.baseIso);
              if (!s || !b) return setFeedback(feedback, 'Ingresa lado igual y base válidos.');
              result = action === 'perimetro' ? perimetroIsoceles(s, b) : areaIsoceles(s, b);
            } else {
              const a = getValue(form.ladoA);
              const b = getValue(form.ladoB);
              const c = getValue(form.ladoC);
              if (!a || !b || !c) return setFeedback(feedback, 'Ingresa 3 lados válidos.');
              result = action === 'perimetro' ? perimetroTriangulo(a, b, c) : areaHeron(a, b, c);
            }
            break;
          }
          case 'pentagono': {
            const a = getValue(form.lado);
            if (!a) return setFeedback(feedback, 'Ingresa un lado válido.');
            if (action === 'perimetro') {
              result = perimetroPentagono(a);
            } else {
              const ap = getValue(form.apotema);
              if (!ap) return setFeedback(feedback, 'Ingresa la apotema válida.');
              result = areaPentagonoPorApotema(a, ap);
            }
            break;
          }
          case 'trapecio': {
            const B = getValue(form.baseMayor);
            const b = getValue(form.baseMenor);
            const h = getValue(form.altura);
            if (action === 'area') {
              if (!B || !b || !h) return setFeedback(feedback, 'Ingresa B, b y h válidos.');
              result = areaTrapecio(B, b, h);
            } else {
              const c = getValue(form.ladoC);
              const d = getValue(form.ladoD);
              if (!B || !b || !c || !d) return setFeedback(feedback, 'Ingresa B, b, C y D válidos.');
              result = perimetroTrapecio(B, b, c, d);
            }
            break;
          }
          case 'cubo': {
            const a = getValue(form.arista);
            if (!a) return setFeedback(feedback, 'Ingresa una arista válida.');
            result = action === 'area' ? areaCubo(a) : volumenCubo(a);
            break;
          }
          case 'prisma': {
            const l = getValue(form.largo);
            const w = getValue(form.ancho);
            const h = getValue(form.alto);
            if (!l || !w || !h) return setFeedback(feedback, 'Ingresa largo, ancho y alto válidos.');
            result = action === 'area' ? areaPrisma(l, w, h) : volumenPrisma(l, w, h);
            break;
          }
          case 'esfera': {
            const r = getValue(form.radio);
            if (!r) return setFeedback(feedback, 'Ingresa un radio válido.');
            result = action === 'area' ? areaEsfera(r) : volumenEsfera(r);
            break;
          }
          case 'cilindro': {
            const r = getValue(form.radio);
            const h = getValue(form.altura);
            if (!r || !h) return setFeedback(feedback, 'Ingresa radio y altura válidos.');
            result = action === 'area' ? areaCilindro(r, h) : volumenCilindro(r, h);
            break;
          }
          case 'cono': {
            const r = getValue(form.radio);
            const h = getValue(form.altura);
            if (!r || !h) return setFeedback(feedback, 'Ingresa radio y altura válidos.');
            result = action === 'area' ? areaCono(r, h) : volumenCono(r, h);
            break;
          }
          case 'piramide': {
            const a = getValue(form.ladoBase);
            const h = getValue(form.altura);
            if (!a || !h) return setFeedback(feedback, 'Ingresa lado base y altura válidos.');
            result = action === 'area' ? areaPiramide(a, h) : volumenPiramide(a, h);
            break;
          }
          default:
            setFeedback(feedback, 'Figura no soportada.');
            return;
        }

        // Mostrar resultado con formato
        const label = action.charAt(0).toUpperCase() + action.slice(1);
        const value = Number(result);
        const pretty = Number.isFinite(value)
          ? (Math.abs(value) < 1e6 ? value.toFixed(4).replace(/\.0+$/, '') : value.toExponential(4))
          : 'inválido';
        const isOk = Number.isFinite(value);
        setFeedback(
          feedback,
          isOk
            ? `${label}: ${pretty} u${action === 'volumen' ? '³' : action === 'area' ? '²' : ''}.`
            : 'Verifica que los valores formen un triángulo válido.',
          isOk
        );

        // UI feedback: resaltar temporalmente la tarjeta
        const card = form.closest('.card');
        card.classList.add('pulse');
        setTimeout(() => card.classList.remove('pulse'), 400);
      } catch (e) {
        setFeedback(feedback, 'Ocurrió un error inesperado.');
        console.error(e);
      }
    });
  });
});

// Estilo para pulso visual (agregado dinámicamente)
const style = document.createElement('style');
style.textContent = `.card.pulse{ box-shadow: 0 0 0 2px var(--accent); transition: box-shadow .4s; }`;
document.head.appendChild(style);

// Inicialización: wire de menú superior
$$('.top-item').forEach((btn) => {
  btn.addEventListener('click', () => showFigure(btn.dataset.figure));
});

// Mostrar figura por defecto
showFigure('cuadrado');

// Transformar notas <small> en tooltips accesibles con icono
(function enhanceFormHelps() {
  const helps = $$('.form small');
  helps.forEach((s, idx) => {
    const text = (s.textContent || '').trim();
    if (!text) return;
    const help = document.createElement('div');
    help.className = 'help';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'help-icon';
    btn.setAttribute('aria-label', 'Ver fórmulas');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'i';
    const tip = document.createElement('div');
    tip.className = 'tooltip';
    tip.textContent = text;
    help.appendChild(btn);
    help.appendChild(tip);
    s.replaceWith(help);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !help.classList.contains('open');
      // cerrar otros
      $$('.help.open').forEach((h) => {
        if (h !== help) {
          h.classList.remove('open');
          const b = $('.help-icon', h);
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      });
      help.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    });
  });

  // cerrar al hacer click fuera o con Escape
  document.addEventListener('click', () => {
    $$('.help.open').forEach((h) => {
      h.classList.remove('open');
      const b = $('.help-icon', h);
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $$('.help.open').forEach((h) => {
        h.classList.remove('open');
        const b = $('.help-icon', h);
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });
})();