// 1. EFECTO CURSOR BRILLITOS (OPTIMIZADO)
let ultimoBrillo = 0; // Control de tiempo para no saturar la memoria

document.addEventListener('mousemove', function(e) {
    let ahora = Date.now();
    // Solo crea un brillo cada 50 milisegundos (evita el lag)
    if (ahora - ultimoBrillo < 50) return; 
    ultimoBrillo = ahora;

    let brillo = document.createElement('div');
    brillo.classList.add('brillo');
    brillo.style.left = e.pageX + 'px';
    brillo.style.top = e.pageY + 'px';
    document.body.appendChild(brillo);
    
    // Se elimina más rápido para liberar memoria
    setTimeout(() => { brillo.remove(); }, 600); 
});

// 2. CARTAS
function abrirCarta(titulo, texto) {
    const audio = new Audio('https://www.soundjay.com/misc/sounds/page-flip-01a.mp3');
    audio.play().catch(e => console.log("Interacción de audio requerida"));
    
    document.getElementById('carta-titulo').innerText = titulo;
    document.getElementById('carta-texto').innerText = texto;
    document.getElementById('modal-carta').classList.remove('oculto');
}

function cerrarCarta() {
    document.getElementById('modal-carta').classList.add('oculto');
}

// 3. JUEGOS: ADIVINA QUIÉN
function verificarAdivinanza() {
    // Convierte lo que Dani escriba a minúsculas
    let respuesta = document.getElementById('respuesta-cancion').value.toLowerCase();
    
    // AQUÍ: Pon el nombre de la película TODO EN MINÚSCULAS y sin acentos.
    // Ejemplo: si fue "El Planeta de los Simios", puedes poner "simios" o "planeta"
    if (respuesta.includes("michael")) { // <-- CAMBIA "michael" por la peli
        document.getElementById('resultado-adivinanza').classList.remove('oculto');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
        // También cambié la pista para que tenga sentido con la pregunta
        alert("Mmm... intenta de nuevo 😉. Pista: Recuerda lo que vimos en el cine.");
    }
}

// 4. JUEGOS: ATRAPA CORAZONES (OPTIMIZADO CON TRANSFORM)
let puntosCorazones = 0;
let intervaloCorazones;

function iniciarAtrapaCorazones() {
    puntosCorazones = 0;
    document.getElementById('puntos-corazones').innerText = puntosCorazones;
    document.getElementById('btn-iniciar-corazones').style.display = 'none';
    const area = document.getElementById('area-corazones');
    area.style.display = 'block';
    area.innerHTML = '';

    intervaloCorazones = setInterval(() => {
        let corazon = document.createElement('div');
        corazon.innerText = "❤️";
        corazon.classList.add('corazon-cayendo');
        corazon.style.left = Math.random() * 90 + "%";
        area.appendChild(corazon);

        // Usamos transform en lugar de top (es mucho más fluido para el navegador)
        requestAnimationFrame(() => {
            corazon.style.transform = "translateY(300px)";
        });

        corazon.onclick = function() {
            puntosCorazones++;
            document.getElementById('puntos-corazones').innerText = puntosCorazones;
            this.remove();
            
            confetti({ particleCount: 15, spread: 30, origin: { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight } });

            if(puntosCorazones === 10) {
                clearInterval(intervaloCorazones);
                area.innerHTML = "<h3 style='margin-top:100px; color:white;'>¡Ganaste un abrazo y un fuze tea! 💖</h3>";
                confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
            }
        };

        // Limpieza de memoria
        setTimeout(() => { if(corazon.parentNode) corazon.remove(); }, 3000);
    }, 600);
}

// 5. MÁQUINA DE MENSAJES
const mensajes = [
    "No te he visto pero se que te ves muy linda.", 
    "Gracias por aparecer en mi vida.", 
    "Me encantas demasiado.",
    "Eres mi notificación favorita.",
    "Te quiero de aqui a mil años luz."
];
function generarMensaje() {
    const pantalla = document.getElementById('pantalla-mensaje');
    pantalla.innerText = "Pensando...";
    pantalla.style.opacity = 0.5;
    setTimeout(() => {
        const random = Math.floor(Math.random() * mensajes.length);
        pantalla.innerText = `"${mensajes[random]}"`;
        pantalla.style.opacity = 1;
    }, 800);
}


// =========================================
//   LÓGICA PARA LOS NUEVOS EXTRAS
// =========================================

// 2. Canjear Ticket VIP
function canjearTicket() {
    confetti({ particleCount: 300, spread: 120, origin: { y: 0.5 } });
    alert("¡Boleto canjeado con éxito! Ve preparando la fecha. ❤️🍕");
}

// 3. Mascota Virtual (Gatito)
const mensajesGatito = [
    "¡Miau! Alguien aquí te quiere mucho.",
    "Eres la persona favorita de mi humano.",
    "No olvides sonreír hoy miau.",
    "¡Qué bonita te ves leyendo esto!"
];

function hablarMascota() {
    const dialogo = document.getElementById('mensaje-mascota');
    if (dialogo) {
        const random = Math.floor(Math.random() * mensajesGatito.length);
        dialogo.innerText = mensajesGatito[random];
        dialogo.classList.remove('oculto');
        
        // El globo de texto desaparece después de 4 segundos
        setTimeout(() => {
            dialogo.classList.add('oculto');
        }, 4000);
    }
}

// 4. Reproductor de Buzón de Voz
let audioReproduciendose = false;
function reproducirBuzon() {
    const audio = document.getElementById('audio-secreto');
    const boton = document.getElementById('btn-play-icon');
    
    if (!audioReproduciendose) {
        audio.play();
        boton.innerText = "⏸️"; // Cambia a pausa
        audioReproduciendose = true;
        // Efecto de confeti sutil mientras escucha tu voz
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } else {
        audio.pause();
        boton.innerText = "▶️"; // Cambia a play
        audioReproduciendose = false;
    }

    audio.onended = function() {
        boton.innerText = "▶️";
        audioReproduciendose = false;
    };
}

// =========================================
//   NUEVAS FUNCIONES DEL TICKET (PDF Y WHATSAPP)
// =========================================

// Generar PDF del Ticket
function descargarPDF() {
    // Lanzamos confeti para celebrar
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    
    // Seleccionamos solo la parte visual del ticket
    const ticketElemento = document.getElementById('mi-ticket-vip');
    
    // Configuramos cómo queremos que salga el PDF
    const opciones = {
        margin:       10,
        filename:     'Mi_Boleto_Especial.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, backgroundColor: '#ff8c00' }, // Respeta el color del fondo
        jsPDF:        { unit: 'mm', format: 'a5', orientation: 'landscape' }
    };

    // Generamos y descargamos
    html2pdf().set(opciones).from(ticketElemento).save();
}

// Enviar mensaje directo a WhatsApp
function enviarWhatsApp() {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
    
    // REEMPLAZA "TU_NUMERO_AQUI" CON TU NÚMERO (Ejemplo de México: 5281XXXXXXXX)
    const numeroTelefono = "TU_NUMERO_AQUI"; 
    
    // El mensaje predeterminado que a ella le aparecerá listo para enviar
    const mensaje = encodeURIComponent("¡Hola! 💖 Acabo de desbloquear mi Boleto Golden en Nuestro Universo. ¡Prepárate para la pizza de pepperoni y las películas!");
    
    // Creamos el enlace y lo abrimos en una nueva pestaña (abre la app de WhatsApp o WhatsApp Web)
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroTelefono}&text=${mensaje}`;
    
    // Esperamos 1.5 segundos para que vea el confeti antes de mandarla a WhatsApp
    setTimeout(() => {
        window.open(urlWhatsApp, '_blank');
    }, 1500);
}

// =========================================
//   JUEGO: AYUDA A POCHACCO (Clics rápidos)
// =========================================
let progresoPochacco = 2; // Empieza en el 2% de la pantalla

function correrPochacco() {
    const pochacco = document.getElementById('pochacco-real');
    const melody = document.getElementById('melody-real');
    const abrazo = document.getElementById('abrazo-sanrio');
    const boton = document.getElementById('btn-correr');
    const mensaje = document.getElementById('mensaje-sanrio-victoria');

    // Cada vez que ella da clic, Pochacco avanza 8%
    progresoPochacco += 8; 
    pochacco.style.left = progresoPochacco + '%';

    // Si Pochacco llega al 75% de la pantalla (donde está Melody)
    if (progresoPochacco >= 75) {
        // Ocultamos las imágenes separadas
        pochacco.style.display = 'none';
        melody.style.display = 'none';
        
        // Mostramos la imagen de ellos abrazados y el mensaje
        abrazo.classList.remove('oculto');
        abrazo.classList.add('fade-in'); // Animación suave
        boton.style.display = 'none';
        mensaje.classList.remove('oculto');
        
        // Súper explosión de confeti rosa y blanco
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#ffb6c1', '#ffffff', '#ff69b4']
        });
    }
}

// =========================================
//   NUEVA LÓGICA PRINCESAS DISNEY (1, 2, 3)
// =========================================

// 1. DESAFÍO ROSA (Bella y Bestia)
let petalosRecolectados = 0;
let intervaloRosa;

function empezarDesafioRosa() {
    petalosRecolectados = 0;
    document.getElementById('contador-petalos').innerText = petalosRecolectados;
    document.getElementById('btn-iniciar-rosa').style.display = 'none';
    const area = document.getElementById('area-petalos');
    area.innerHTML = ''; // Limpiar

    intervaloRosa = setInterval(() => {
        let petalo = document.createElement('div');
        petalo.classList.add('petalo-rosa');
        petalo.style.left = Math.random() * 90 + "%";
        
        // Efecto pequeño de brillo en el pétalo
        petalo.style.boxShadow = "0 0 10px rgba(255,182,193,0.5)";

        area.appendChild(petalo);

        // Al hacer clic en el pétalo
        petalo.onclick = function() {
            petalosRecolectados++;
            document.getElementById('contador-petalos').innerText = petalosRecolectados;
            this.remove(); // Borrar pétalo

            // Confeti pequeño rosa al recolectar
            confetti({ particleCount: 15, spread: 30, origin: { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight }, colors: ['#ffb6c1'] });

            // Victoria: 5 pétalos
            if(petalosRecolectados === 5) {
                clearInterval(intervaloRosa);
                desbloquearSecretoRosa();
            }
        };

        // Limpieza de memoria (si no lo toca)
        setTimeout(() => { if(petalo.parentNode) petalo.remove(); }, 4000);
    }, 900); // Aparece un pétalo cada 0.9 segundos
}

function desbloquearSecretoRosa() {
    confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } });
    
    // Cambiamos de caja (ocultamos candado, mostramos secreto)
    setTimeout(() => {
        document.getElementById('caja-candado-rosa').classList.add('oculto');
        document.getElementById('mensaje-secreto').classList.remove('oculto');
        document.getElementById('mensaje-secreto').classList.add('fade-in');
    }, 1500);
}


// 2. JUEGO ZAPATILLA (Cenicienta)
function verificarZapatilla(respuesta) {
    if (respuesta === 'correcta') {
        const zapatilla = document.getElementById('zapatilla-cristal-real');
        zapatilla.style.filter = "drop-shadow(0 0 30px #fff)"; // Brillo gigante
        zapatilla.style.transform = "scale(1.2) rotate(15deg)";
        
        // Confeti mágico plateado/celeste
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#dfe6e9', '#74b9ff', '#ffffff'] });

        // Mostramos el mensaje de éxito
        document.getElementById('mensaje-cenicienta-victoria').classList.remove('oculto');
        document.getElementById('mensaje-cenicienta-victoria').classList.add('fade-in');
        
        // Ocultamos las siluetas equivocadas
        document.querySelectorAll('.silueta-zapatilla:not(#zapatilla-cristal-real)').forEach(silu => {
            silu.style.display = 'none';
        });

    } else {
        alert("Esa no es la zapatilla mágica Bibbidi-Bobbidi-Boo... intenta de nuevo.");
    }
}

// =========================================
//   EFECTO: CUPONES RASCABLES (SCRATCH-OFF)
// =========================================

window.addEventListener('load', () => {
    const canvases = document.querySelectorAll('.canvas-rascable');
    
    canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        // Ajustar el tamaño del canvas al de su contenedor
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        // Pintar la capa dorada encima
        const gradiente = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradiente.addColorStop(0, '#bf953f'); // Dorado oscuro
        gradiente.addColorStop(0.5, '#fcf6ba'); // Dorado brillante
        gradiente.addColorStop(1, '#b38728'); // Dorado oscuro
        
        ctx.fillStyle = gradiente;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Agregar texto de instrucciones
        ctx.fillStyle = '#4a3b10';
        ctx.font = 'bold 22px Poppins';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✨ RÁSPAME ✨', canvas.width / 2, canvas.height / 2);

        let isDrawing = false;
        let revelado = false;

        function raspar(x, y) {
            if (revelado) return;
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2); // Tamaño del borrador
            ctx.fill();

            // Verificar qué porcentaje se ha raspado
            verificarPorcentaje(canvas, ctx);
        }

        function verificarPorcentaje(canvas, ctx) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparentes = 0;

            // Revisamos cuántos pixeles ya se borraron (el canal Alpha es 0)
            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) transparentes++;
            }

            const totalPixeles = pixels.length / 4;
            const porcentaje = (transparentes / totalPixeles) * 100;

            // Si ya raspó más del 55%, revelamos el resto automáticamente
            if (porcentaje > 55 && !revelado) {
                revelado = true;
                canvas.style.opacity = '0'; // Desvanece el canvas
                
                // ¡Lanzar confeti!
                const rect = canvas.getBoundingClientRect();
                const xConfeti = (rect.left + rect.width / 2) / window.innerWidth;
                const yConfeti = (rect.top + rect.height / 2) / window.innerHeight;
                
                confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { x: xConfeti, y: yConfeti },
                    colors: ['#ffb6c1', '#ffd700', '#ffffff']
                });

                // Quitar de la memoria después del desvanecimiento
                setTimeout(() => canvas.remove(), 500);
            }
        }

        // Eventos de Mouse (Computadora)
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            raspar(e.offsetX, e.offsetY);
        });
        canvas.addEventListener('mousemove', (e) => {
            if (isDrawing) raspar(e.offsetX, e.offsetY);
        });
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseleave', () => isDrawing = false);

        // Eventos Touch (Celular)
        canvas.addEventListener('touchstart', (e) => {
            isDrawing = true;
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            raspar(touch.clientX - rect.left, touch.clientY - rect.top);
            e.preventDefault();
        }, { passive: false });
        
        canvas.addEventListener('touchmove', (e) => {
            if (isDrawing) {
                const touch = e.touches[0];
                const rect = canvas.getBoundingClientRect();
                raspar(touch.clientX - rect.left, touch.clientY - rect.top);
                e.preventDefault();
            }
        }, { passive: false });
        
        canvas.addEventListener('touchend', () => isDrawing = false);
    });
});

// =========================================
//   LÓGICA DE MÚSICA Y PHOTOCARDS
// =========================================

// Para voltear la Photocard 3D
function voltearCarta(elemento) {
    elemento.classList.toggle('flipped');
}

// Para reproducir / pausar la música en Historia
function toggleMusica() {
    const audio = document.getElementById('musica-love');
    const btn = document.getElementById('disco-btn');
    
    if (audio.paused) {
        audio.play();
        btn.classList.add('playing');
    } else {
        audio.pause();
        btn.classList.remove('playing');
    }
}


// =========================================
//   EL LECTOR DE MENTES (ILUSIÓN DE EDWARD)
// =========================================

const inputMente = document.getElementById('input-mente');

if (inputMente) {
    // 1. AQUÍ ESCRIBES EL MENSAJE SECRETO QUE QUIERES QUE APAREZCA
    // No importa qué escriba ella, esto es lo único que va a salir en pantalla.
    const mensajeOculto = "Eres la única persona que silencia el ruido de mi cabeza. Mi mente siempre es un caos, pero contigo encuentro paz absoluta. Sigo sin poder leer tus pensamientos, pero espero que sepas que los míos te pertenecen por la eternidad... ❤️";
    
    let indiceTexto = 0;

    // 2. INTERCEPTAMOS SU TECLADO
    inputMente.addEventListener('input', function(e) {
        
        // Si ella intenta borrar una letra (tecla Backspace)
        if (e.inputType === 'deleteContentBackward') {
            indiceTexto = Math.max(0, indiceTexto - 1);
        } 
        // Si ella escribe CUALQUIER otra tecla
        else {
            if (indiceTexto < mensajeOculto.length) {
                indiceTexto++;
            }
        }
        
        // 3. LA MAGIA: Sobrescribimos lo que ella intentó escribir con nuestro mensaje
        this.value = mensajeOculto.substring(0, indiceTexto);
        
        // Mantenemos el scroll siempre hasta abajo por si el texto es muy largo
        this.scrollTop = this.scrollHeight;
    });
}

// =========================================
//   LÓGICA DEL CONTRATO DE RELACIÓN
// =========================================

const canvas = document.getElementById('canvas-firma');
const btnAceptar = document.getElementById('btn-aceptar-contrato');
const checkboxes = document.querySelectorAll('.check-regla');

if (canvas && btnAceptar) {
    const ctx = canvas.getContext('2d');
    
    // Ajustar el canvas al tamaño real en la pantalla
    function ajustarCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    window.addEventListener('resize', ajustarCanvas);
    ajustarCanvas();

    // Variables para el dibujo
    let isDrawing = false;
    let hayFirma = false;

    // Configuración del lápiz
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000080'; // Tono de tinta de pluma azul

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function startDrawing(e) {
        isDrawing = true;
        hayFirma = true; // Ya hizo un trazo
        const pos = getMousePos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        e.preventDefault();
    }

    function draw(e) {
        if (!isDrawing) return;
        const pos = getMousePos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        verificarContrato(); // Revisamos si ya cumplió todo
        e.preventDefault();
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.closePath();
    }

    // Eventos Mouse (PC)
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Eventos Touch (Celular)
    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);

    // Función que verifica si puede avanzar
    function verificarContrato() {
        // 1. Verificar si todas las casillas están marcadas
        let todasMarcadas = true;
        checkboxes.forEach(chk => {
            if (!chk.checked) todasMarcadas = false;
        });

        // 2. Verificar si hay firma (hayFirma se volvió true al tocar el canvas)
        if (todasMarcadas && hayFirma) {
            btnAceptar.removeAttribute('disabled');
        } else {
            btnAceptar.setAttribute('disabled', 'true');
        }
    }

    // Escuchar cambios en los checkboxes
    checkboxes.forEach(chk => {
        chk.addEventListener('change', verificarContrato);
    });

    // Acción final al dar clic en Aceptar
    btnAceptar.addEventListener('click', () => {
        // Cambia 'secreto.html' por la página a la que quieras que vaya después de firmar
        window.location.href = 'secreto.html'; 
    });
}

// =========================================
//   DESBLOQUEO POR ARRASTRE (CAJA TURQUESA)
// =========================================

const monoCaja = document.getElementById('mono-caja');
const tapaCaja = document.getElementById('tapa-caja');
const sobresContainer = document.getElementById('sobres-container');
const textoInstruccion = document.getElementById('texto-instruccion');

if (monoCaja && tapaCaja) {
    let isDragging = false;
    let startX = 0;

    function iniciarArrastre(e) {
        isDragging = true;
        startX = e.clientX || (e.touches && e.touches[0].clientX);
        monoCaja.style.transition = 'none'; // Quitamos transición para que siga al dedo fluido
        e.preventDefault(); // Evita comportamientos raros en celular
    }

    function arrastrar(e) {
        if (!isDragging) return;
        
        let currentX = e.clientX || (e.touches && e.touches[0].clientX);
        let moveX = currentX - startX;

        // Movemos el moño visualmente
        monoCaja.style.transform = `translateX(${moveX}px) scale(1.1)`;

        // Si arrastra el moño más de 100 píxeles (a la derecha o izquierda), ¡SE ABRE!
        if (Math.abs(moveX) > 100) {
            isDragging = false;
            abrirCajaMagica();
        }
    }

    function soltar() {
        if (!isDragging) return;
        isDragging = false;
        // Si no lo arrastró lo suficiente, el moño regresa a su lugar como liga
        monoCaja.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        monoCaja.style.transform = `translateX(0px) scale(1)`;
    }

    function abrirCajaMagica() {
        // Desaparece el moño suavemente
        monoCaja.style.opacity = '0';
        
        // La tapa sale volando
        tapaCaja.classList.add('vuela-tapa');
        
        // Ocultamos el texto de instrucciones
        textoInstruccion.style.opacity = '0';

        // Las cartas flotan hacia afuera después de medio segundo
        setTimeout(() => {
            sobresContainer.classList.add('mostrar-cartas');
        }, 400);
    }

    // Eventos Mouse
    monoCaja.addEventListener('mousedown', iniciarArrastre);
    window.addEventListener('mousemove', arrastrar);
    window.addEventListener('mouseup', soltar);

    // Eventos Touch (Celular)
    monoCaja.addEventListener('touchstart', iniciarArrastre, {passive: false});
    window.addEventListener('touchmove', arrastrar, {passive: false});
    window.addEventListener('touchend', soltar);
}

// =========================================
//   LÓGICA MINIJUEGO WALUIGI INTERACTIVO 2.0
// =========================================
const btnDestruir = document.getElementById('btn-destruir');
const thwomp = document.getElementById('thwomp');
const waluigi = document.getElementById('waluigi');
const premioInteractivo = document.getElementById('premio-interactivo');
const textoWaluigi = document.getElementById('texto-instruccion-waluigi');
const cofreClic = document.getElementById('cofre-clic');
const btnRegaloFinal = document.getElementById('btn-regalo-final');
const confettiContainer = document.getElementById('confetti');

if (btnDestruir && thwomp && waluigi && cofreClic) {
    
    // FASE 1: APLASTAR A WALUIGI
    btnDestruir.addEventListener('click', () => {
        btnDestruir.classList.add('ocultar-boton');
        textoWaluigi.innerText = "¡Oh, oh...";
        thwomp.classList.add('thwomp-caer');

        setTimeout(() => {
            document.body.classList.add('temblor-pantalla');
            waluigi.classList.add('waluigi-aplastado');
            setTimeout(() => { document.body.classList.remove('temblor-pantalla'); }, 300);
        }, 400);

        // Revelar el panel de cristal con el cofre flotando
        setTimeout(() => {
            thwomp.style.top = "-500px"; // El Thwomp sube
            textoWaluigi.style.opacity = "0"; // Borramos el titulo principal
            premioInteractivo.classList.add('mostrar-premio');
        }, 1500);
    });

    // FASE 2: INTERACCIÓN CON EL COFRE (LA EXPLOSIÓN)
    cofreClic.addEventListener('click', () => {
        // 1. Estallar el cofre
        cofreClic.classList.add('ocultar-cofre');
        
        // 2. Cambiar textos del panel de cristal
        document.querySelector('.subtexto-victoria').innerText = "¡Waluigi ha sido eliminado! Disfruta tu sorpresa...";

        // 3. ¡LLUVIA DE CONFETI!
        crearExplosionConfeti();

        // 4. Revelar el botón final después de la explosión (1 segundo)
        setTimeout(() => {
            btnRegaloFinal.classList.add('mostrar-boton-final');
        }, 1000);
    });
}

// FUNCIÓN PARA GENERAR PARTÍCULAS DE CONFETI
function crearExplosionConfeti() {
    const colores = ['#ffb6c1', '#30D5C8', '#ffd700', '#ff4d6d', '#fff'];
    const cantidad = 100; // Número de papelitos

    for (let i = 0; i < cantidad; i++) {
        const confetto = document.createElement('div');
        confetto.classList.add('confetto');
        
        // Posición horizontal aleatoria
        confetto.style.left = Math.random() * 100 + 'vw';
        
        // Color aleatorio del array
        confetto.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
        
        // Tamaño aleatorio
        const tamaño = Math.random() * 10 + 5 + 'px';
        confetto.style.width = tamaño;
        confetto.style.height = tamaño;
        
        // Retraso de animación aleatorio para que no caigan todos juntos
        confetto.style.animationDelay = Math.random() * 2 + 's';

        confettiContainer.appendChild(confetto);

        // Limpiar el HTML después de 5 segundos para no saturar la página
        setTimeout(() => {
            confetto.remove();
        }, 5000);
    }
}

// =========================================
//   CARTA FINAL: EFECTO MÁQUINA DE ESCRIBIR PEACH
// =========================================

const contenedorCartaPeach = document.getElementById('texto-carta-peach');

if (contenedorCartaPeach) {
    
    // Texto divertido y gamer, cero empalagoso, pero con temática Peach 👑
    const mensajeFinal = "¡Felicidades, Jugadora 1 (Dani)! 👑<br><br>" +
                         "Por fin le dimos su merecido a ese tramposo de Waluigi y recuperamos el control de la página. <br><br>" +
                         "Hacer todo este desmadre de minijuegos y códigos fue súper divertido, pero la verdad es que armé todo esto porque eres la mejor compañera de cooperativo que podría pedir. Gracias por aguantar mis locuras y por ser mi '1-Up' todos los días. <br><br>" +
                         "¡Misión cumplida! Nos vemos en el siguiente nivel. <br><br>" +
                         "- Tu Player 2, David Alejandro 🎮";

    const velocidadEscritura = 40; 
    let indiceCaracter = 0;
    let textoHTML = ""; 
    
    function escribirTextoPeach() {
        
        if (mensajeFinal.charAt(indiceCaracter) === '<') {
            let etiquetaGanchada = "";
            while (mensajeFinal.charAt(indiceCaracter) !== '>') {
                etiquetaGanchada += mensajeFinal.charAt(indiceCaracter);
                indiceCaracter++;
            }
            etiquetaGanchada += '>';
            textoHTML += etiquetaGanchada;
            indiceCaracter++;
        } else {
            textoHTML += mensajeFinal.charAt(indiceCaracter);
            indiceCaracter++;
        }

        contenedorCartaPeach.innerHTML = textoHTML;

        if (indiceCaracter < mensajeFinal.length) {
            setTimeout(escribirTextoPeach, velocidadEscritura);
        } else {
            // Termina y muestra la flechita y el botón
            document.getElementById('flecha-continuar').style.display = 'block';
            document.getElementById('btn-volver-inicio').classList.add('mostrar-boton');
        }
    }

    setTimeout(escribirTextoPeach, 1000);
}

// =========================================
//   CEREBRO CONTEXTUAL 100% ALEATORIO: PEACH 👑💬
// =========================================
const peachAvatar = document.getElementById('peach-avatar');
const peachChat = document.getElementById('peach-chat');
const peachCerrar = document.getElementById('peach-cerrar');
const chatHistorial = document.getElementById('chat-historial');
const chatInput = document.getElementById('chat-input');
const btnEnviar = document.getElementById('btn-enviar');

if (peachAvatar) {
    
// --- 1. EL RADAR DE SECCIONES EXTREMO ---
const rutaActual = window.location.pathname.toLowerCase();
let seccionActual = "general"; 

// Ahora Peach detecta el número exacto de la carta
if (rutaActual.includes("carta1") || rutaActual.includes("carta-1")) seccionActual = "carta1";
else if (rutaActual.includes("carta2") || rutaActual.includes("carta-2")) seccionActual = "carta2";
else if (rutaActual.includes("carta3") || rutaActual.includes("carta-3")) seccionActual = "carta3";
else if (rutaActual.includes("carta")) seccionActual = "cartas"; // Por si hay un menú principal de cartas

else if (rutaActual.includes("historia")) seccionActual = "historia";
else if (rutaActual.includes("juego") || rutaActual.includes("waluigi")) seccionActual = "juegos";
else if (rutaActual.includes("contrato")) seccionActual = "contrato";
else if (rutaActual.includes("secreto") || rutaActual.includes("pin")) seccionActual = "secreto";
else if (rutaActual.includes("sorpresa") || rutaActual.includes("ticket")) seccionActual = "sorpresa";

// --- 2. BASE DE DATOS ALEATORIA POR SECCIÓN ---
const infoSecciones = {
    general: {
        bienvenidas: ["¡Qué bonito verte navegar por el castillo! Usa el menú para explorar.", "¡Hola de nuevo! Si te pierdes, ya sabes a quién preguntarle."],
        pistas: ["Revisa bien todas las páginas, a veces hay botoncitos escondidos."]
    },
    cartas: {
        bienvenidas: ["¡Llegaste a las Cartas! 💌 Aquí hay mensajes muy especiales para ti."],
        pistas: ["Tómate tu tiempo para abrir cada sobre."]
    },
    // ¡NUEVO! Mensajes específicos para cada carta
    carta1: {
        bienvenidas: [
            "¡Uy, la Carta 1! 💌 Aquí empieza todo. David se inspiró muchísimo escribiendo esto para ti.",
            "¡Primera carta! 💌 Dicen por ahí que tiene vibras de Crepúsculo y Enhypen... Léela con calma."
        ],
        pistas: ["Lee cada línea despacito. Y si necesitas un hechizo, pídemelo en el chat."]
    },
    carta2: {
        bienvenidas: [
            "¡Llegaste a la Carta 2! 💌 Ahh, la carta de las promesas. Prepárate para suspirar.",
            "Segunda carta lista. 💌 Ese abrazo del que habla el texto va a estar increíble, ¡ya quiero que se vean!"
        ],
        pistas: ["Las promesas de David son reales. ¡Asegúrate de cobrar ese abrazo cuando se vean!"]
    },
    carta3: {
        bienvenidas: [
            "¡La Carta 3! 💌 El gran cierre. Y hablando de lugares favoritos... a mí también me dio hambre de hamburguesas.",
            "¡Última carta de esta dinámica! 💌 Quién diría que la lluvia en un Carl's Jr. haría un recuerdo tan bonito, ¿verdad?"
        ],
        pistas: ["Si ya terminaste de leer las cartas, ¡prepárate para la siguiente sorpresa en el menú!"]
    },
    // ... (Aquí sigue el resto de tus secciones sin cambios)
    historia: {
        bienvenidas: ["¡La sección de Historia! 📸 Prepárate para ver recuerdos muy bonitos."],
        pistas: ["Da clic en las fotos para ver si tienen algún mensaje oculto."]
    },
    juegos: {
        bienvenidas: ["¡Hora de jugar! 🎮 Vamos a ver qué tan buena eres."],
        pistas: ["No dejes que el juego te gane, mantén los ojos bien abiertos."]
    },
    contrato: {
        bienvenidas: ["¡El Contrato! 📜 Uy, hay cláusulas muy interesantes aquí."],
        pistas: ["Esa cláusula de las pizzas y los gatos se ve muy oficial, ¡más te vale firmar!"]
    },
    secreto: {
        bienvenidas: ["Zona restringida: El Secreto 🔒. ¡A pensar!"],
        pistas: ["Piensa en números importantes... el 7 suena como una buena pista."]
    },
    sorpresa: {
        bienvenidas: ["¡La Sorpresa Final! 🎟️ Llegaste a la mejor parte."],
        pistas: ["¡Rasca los tickets para ver qué te ganaste!"]
    }
};

    // --- 3. LISTAS LARGAS PARA RECADOS Y SECRETOS ---
    const recaditos = [
        "David me pidió que te recordara que eres su lugar favorito en el mundo. 🏡",
        "Me dejó un papelito que dice: 'Dile a Dani que su sonrisa ilumina mis días'. ✨",
        "Tengo un recado urgente: 'Te amo muchísimo, mi compañera de vida'. 💖",
        "David me dijo que te dijera que eres la niña más hermosa de todo el reino. 👑",
        "Me pidió que te avisara que cada línea de código de esta página la hizo pensando en ti."
    ];

    const secretos = [
        "David se desveló horas escribiendo código en Flask y arreglando bases de datos solo para verte sonreír hoy.",
        "Entre nosotras... me chismearon que David prefiere mil veces hacer cooperativo contigo que cualquier otra cosa. 🎮",
        "Me susurró que tú eres su 'nuevo sueño', justito como en Enredados. 🏮",
        "Puso todo su esfuerzo para que la página no fallara. ¡Te sacaste la lotería con este chico!",
        "Dicen por ahí que el 7 de mayo a las 2 pm es su hora favorita en todo el universo. ✨"
    ];

    // --- 4. LA INTELIGENCIA DE CHAT ---
    function agregarMensaje(texto, emisor) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('mensaje', emisor);
        divMensaje.innerHTML = texto;
        chatHistorial.appendChild(divMensaje);
        chatHistorial.scrollTop = chatHistorial.scrollHeight;
    }

    // Función para sacar un elemento al azar de cualquier lista
    function sacarAlAzar(lista) {
        return lista[Math.floor(Math.random() * lista.length)];
    }

    // --- 4. LA INTELIGENCIA DE CHAT CON MAGIA Y PLÁTICA ✨💬 ---
    function responder(textoUsuario) {
        const mensaje = textoUsuario.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        let respuestaElegida = "";
        let ejecutarMagia = null; 

        // ==========================================
        // 🔮 1. LOS HECHIZOS (COMANDOS SECRETOS)
        // ==========================================
        if (mensaje === "lluvia de amor") {
            respuestaElegida = "¡Hechizo activado! ✨ Disfruta la lluvia, princesa.";
            ejecutarMagia = lanzarLluviaDeAmor;
        
        } else if (mensaje === "gravedad cero") {
            respuestaElegida = "¡Hechizo activado! ✨ Agárrate fuerte, nos quedamos sin gravedad en la página.";
            ejecutarMagia = () => document.body.classList.toggle('gravedad-cero');
        
        } else if (mensaje === "apaga la luz") {
            respuestaElegida = "¡Hechizo activado! ✨ Modo cine romántico encendido.";
            ejecutarMagia = () => document.body.classList.toggle('modo-noche-neon');
        
        } else if (mensaje === "bomba a waluigi") {
            respuestaElegida = "¡KABOOM! 💣 He lanzado un ataque directo. ¡Ganaste!";
            ejecutarMagia = destruirWaluigi;

        // ==========================================
        // 💬 2. LA PLÁTICA ENCADENADA Y LA MISIÓN SECRETA
        // ==========================================
        
        // Si pide el tiempo de la cita
        } else if (mensaje.includes("tiempo") || mensaje.includes("cuanto") || mensaje.includes("vimos") || mensaje.includes("cita")) {
            const fechaCita = new Date('2026-05-07T14:00:00'); 
            const fechaActual = new Date();
            const diferencia = fechaActual - fechaCita;
            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            respuestaElegida = `⏱️ Han pasado exactamente ${dias} días y ${horas} horas desde esa cita en Carl's Jr. bajo la lluvia. ☔🍔 Oye... a todo esto, ¿sí te gustaron las hamburguesas ese día?`;

        // Si responde a lo de las hamburguesas
        } else if (mensaje.includes("si") || mensaje.includes("mucho") || mensaje.includes("obvio") || mensaje.includes("encantaron") || mensaje.includes("ricas") || mensaje.includes("hamburguesa")) {
            respuestaElegida = "¡Qué bueno! David me dijo que ya cuenta los días para llevarte de nuevo. 🥰 Por cierto, ¿ya leíste todas las cartas o te falta alguna?";

        // Si hablan de las cartas
        } else if (mensaje.includes("carta") || mensaje.includes("leer") || mensaje.includes("lei") || mensaje.includes("falta")) {
            respuestaElegida = "💌 Esas cartas tienen mucho sentimiento. David se inspiró muchísimo con las referencias a Crepúsculo y Enhypen. Dime, ¿cuál de las tres cartas ha sido tu favorita hasta ahora?";

        // Si elige una carta favorita
        } else if (mensaje.includes("1") || mensaje.includes("2") || mensaje.includes("3") || mensaje.includes("primera") || mensaje.includes("segunda") || mensaje.includes("tercera")) {
            respuestaElegida = "¡Qué bonita elección! Voy a guardar el dato para contárselo a David al rato. 🤫 Oye, cambiando de tema, ¿ya viste la sección del contrato? ¡Dime que ya lo firmaste!";

        // LA MISIÓN SECRETA
        } else if (mensaje.includes("mision") || mensaje.includes("reto") || mensaje.includes("juego") || mensaje.includes("contraseña")) {
            respuestaElegida = "🔒 ¡Activaste la bóveda secreta! David me dejó un mensaje oculto solo para ti, pero necesito que me digas la contraseña. Pista: Es el nombre de tu marca de pizza favorita para los maratones.";

        // SI ADIVINA LA CONTRASEÑA DE LA PIZZA
        } else if (mensaje.includes("domino") || mensaje.includes("dominos") || mensaje.includes("domino's")) {
            respuestaElegida = "✅ ¡CONTRASEÑA CORRECTA! 🍕 El mensaje secreto de David es: 'Gracias por dejarme ser el Peter Kavinsky de tu historia. Te extraño demasiado'. ¡Awww! ¿A poco no es el más lindo?";
            ejecutarMagia = "confeti"; // Activa el confeti si ganas

        // ==========================================
        // 💌 3. RESPUESTAS NORMALES (Recaditos, Pistas, etc.)
        // ==========================================
        } else if (mensaje.includes("recado") || mensaje.includes("recadito") || mensaje.includes("mensaje")) {
            respuestaElegida = "💌 " + sacarAlAzar(recaditos);
        
        } else if (mensaje.includes("pista") || mensaje.includes("ayuda") || mensaje.includes("atorada")) {
            respuestaElegida = "🔍 " + sacarAlAzar(infoSecciones[seccionActual].pistas);
        
        } else if (mensaje.includes("secreto") || mensaje.includes("chisme")) {
            respuestaElegida = "🤭 Secreto: " + sacarAlAzar(secretos);
        
        } else if (mensaje.includes("hola") || mensaje.includes("holi")) {
            respuestaElegida = "¡Holi! Recuerda que puedes pedirme pistas, recaditos, chismes... o si te atreves, pídeme una 'misión'. 💖";
        
        } else {
            const comodines = [
                "¡Qué lindo! Oye, si quieres jugar un mini-juego conmigo aquí mismo, escríbeme la palabra 'misión'. 😉",
                "Jeje, yo solo sé de códigos y recaditos. ¡Pídeme un 'recadito' para ver qué me dejó David para ti!",
                "Me encanta platicar contigo. Oye, ¿ya me pediste un 'chisme' hoy?"
            ];
            respuestaElegida = sacarAlAzar(comodines);
        }

        // --- SIMULAR QUE PEACH PIENSA Y ESTÁ ESCRIBIENDO ---
        const idPensando = "pensando-" + Date.now();
        agregarMensaje("Escribiendo...", `peach-pensando-${idPensando}`);

        setTimeout(() => {
            const msgPensando = document.querySelector(`.peach-pensando-${idPensando}`);
            if (msgPensando) msgPensando.remove();
            
            agregarMensaje(respuestaElegida, 'peach');

            // Si detectó un hechizo o ganó el juego, lo lanza
            if (ejecutarMagia) {
                if (ejecutarMagia === "confeti" && typeof confetti === "function") {
                    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                } else if (typeof ejecutarMagia === "function") {
                    setTimeout(ejecutarMagia, 500); 
                }
            }

        }, 1200); 
    }

    // ==========================================
    // 🛠️ FUNCIONES DE LOS HECHIZOS
    // ==========================================
    function lanzarLluviaDeAmor() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const corazon = document.createElement('div');
                corazon.innerHTML = '💖';
                corazon.classList.add('corazon-magico');
                corazon.style.left = Math.random() * 100 + 'vw';
                corazon.style.fontSize = (Math.random() * 20 + 10) + 'px';
                document.body.appendChild(corazon);
                
                setTimeout(() => corazon.remove(), 3000);
            }, i * 100); 
        }
    }

    function destruirWaluigi() {
        const waluigi = document.querySelector('.waluigi-sprite');
        if (waluigi) {
            waluigi.classList.add('explosion-efecto');
            setTimeout(() => {
                alert("Waluigi fue derrotado por la magia de Peach. ¡Puedes avanzar!");
            }, 600);
        } else {
            agregarMensaje("Ups, parece que Waluigi no está en esta página. Úsalo cuando lo veas.", 'peach');
        }
    }

    // --- 5. BIENVENIDA AUTOMÁTICA Y ALEATORIA ---
    setTimeout(() => {
        const saludoElegido = sacarAlAzar(infoSecciones[seccionActual].bienvenidas);
        const mensajeCompleto = `${saludoElegido}<br><br>
        <strong>Puedes escribirme cosas como:</strong><br>
        🔍 <em>"Dame una pista"</em><br>
        💌 <em>"Dame un recadito"</em><br>
        🎮 <em>"Dame una misión"</em><br>
        ⏱️ <em>"¿Cuánto tiempo llevamos?"</em>`;

        agregarMensaje(mensajeCompleto, 'peach');
    }, 1500); 

    // --- 6. EVENTOS DE CLIC Y TECLADO ---
    peachAvatar.addEventListener('click', () => {
        peachChat.classList.remove('oculto');
        chatInput.focus(); 
    });

    peachCerrar.addEventListener('click', () => {
        peachChat.classList.add('oculto');
    });

    function procesarEnvio() {
        const texto = chatInput.value.trim();
        if (texto !== "") {
            agregarMensaje(texto, 'dani'); 
            chatInput.value = ""; 
            responder(texto); 
        }
    }

    btnEnviar.addEventListener('click', procesarEnvio);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') procesarEnvio();
    });
}
// =========================================
//   MÚSICA CONTINUA ENTRE PÁGINAS 🎵
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const musica = document.getElementById('musica-fondo');

    if (musica) {
        // 1. Al cargar la página, revisamos si el navegador recuerda en qué segundo íbamos
        const tiempoGuardado = localStorage.getItem('tiempoMusica');
        
        if (tiempoGuardado) {
            musica.currentTime = parseFloat(tiempoGuardado); // Ponemos la canción en ese segundo
        }

        // 2. Mientras la música suena, guardamos el segundo exacto constantemente
        musica.addEventListener('timeupdate', () => {
            localStorage.setItem('tiempoMusica', musica.currentTime);
        });
    }
});

// =========================================
//   CONTROL DE AUDIO: ENHYPEN VS FONDO 🎵
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const musicaFondo = document.getElementById('musica-fondo');
    // Actualizado con el ID exacto que le pusiste
    const musicaEnhypen = document.getElementById('musica-love');

    // Solo ejecutamos esto si ambos audios existen en esta pestaña
    if (musicaFondo && musicaEnhypen) {
        
        // 1. Cuando Dani le dé PLAY a la de Enhypen
        musicaEnhypen.addEventListener('play', () => {
            musicaFondo.pause(); // Se calla la de fondo
        });

        // 2. Cuando Dani le dé PAUSA a la de Enhypen
        musicaEnhypen.addEventListener('pause', () => {
            musicaFondo.play(); // Vuelve a sonar la de fondo solita
        });

        // 3. Cuando la canción de Enhypen SE ACABE 
        // (Aunque tienes "loop", por si acaso lo dejamos)
        musicaEnhypen.addEventListener('ended', () => {
            musicaFondo.play(); 
        });
    }
});

// =========================================
//   🐼 LÓGICA DEL PANDA MENSAJERO
// =========================================

// La lista de mensajes
const mensajesPanda = [
    "Porque hasta cuando vemos peliculas en discord se siente como si estuviera alado tuyo.",
    "Eres de MI personas favorita",
    "Tienes una vibra increíble que solo con hablar alegras mi dia",
    "En cualquier multiverso siempre te buscaria a ti",
    "Dani, gracias por hacer que los momentos juntos sean siempre especiales.",
    "Si fueras una película, definitivamente serías mi favorita para ver en bucle.",
    "Me haces reír muchísimo, y eso vale oro.",
    "Eres como las linternas flotantes, iluminas todo a tu alrededor.",
    "No importa cuál sea el plan, si es contigo, sé que me la voy a pasar genial.",
    "Me encanta todo lo que hemos compartido en este tiempo",
    "Admiro mucho lo linda y auténtica que eres.",
    "Haces que cualquier día ordinario se sienta como una aventura.",
    "Me gusta mucho escucharte hablar de las cosas que te emocionan.",
    "Te adoto 3 millones dani.",
    "Simplemente pasaba a recordarte que te quiero mucho y que me importas okei?"
];

function despertarPanda() {
    const pandaImg = document.getElementById('imagen-panda');
    const globo = document.getElementById('globo-texto');
    const mensajeTexto = document.getElementById('mensaje-panda');

    // 1. Cambiar la imagen al panda feliz/despierto
    // RECUERDA: Cambia "PANDA_DESPIERTO.gif" por el nombre real de tu archivo
    pandaImg.src = "snooze-sleepy.gif"; 

    // 2. Hacer que el panda dé un saltito
    pandaImg.classList.remove('panda-salto'); // Reinicia la animación
    void pandaImg.offsetWidth; // Truco de código para forzar el reinicio
    pandaImg.classList.add('panda-salto');

    // 3. Elegir una frase al azar de la lista correcta
    const fraseElegida = mensajesPanda[Math.floor(Math.random() * mensajesPanda.length)];
    
    // 4. Mostrar el globo con el texto
    mensajeTexto.innerHTML = fraseElegida;
    globo.classList.remove('oculto');

    // 5. Lanzar un poquito de confeti en el centro para celebrar el recadito
    if (typeof confetti === "function") {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
        });
    }

    // 6. Que el panda se vuelva a dormir después de 8 segundos
    setTimeout(() => {
        globo.classList.add('oculto');
        // Aquí regresa al panda dormido
        pandaImg.src = "snooze-sleepy.gif"; 
    }, 8000);
}

