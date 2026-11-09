const STORAGE_KEY = "detectiveDigitalFinal";
let appState = loadState(), currentCase = null, activeCategory = "asesinatos";
function loadState() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
            investigator: "", cases: {
            }, activity: []
        };
    }
    catch (e) {
        return {
            investigator: "", cases: {
            }, activity: []
        };
    }
}
function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}
function stateFor(id) {
    if (!appState.cases[id]) appState.cases[id] = {
        examined: [], interviewed: [], sceneReviewed: false, notes: "", accusation: "", submitted: false, score: 0
    };
    return appState.cases[id];
}
function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }
    [c]));
}
function showView(id) {
    document.querySelectorAll(".view").forEach(v => v.classList.add("d-none"));
    document.getElementById(id).classList.remove("d-none");
}
function recordActivity(message) {
    appState.activity.unshift({
        message, time: new Date().toLocaleString("es-HN")
    });
    appState.activity = appState.activity.slice(0, 15);
    saveState();
}
function startApp() {
    if (appState.investigator) {
        document.getElementById("investigatorTag").textContent = appState.investigator.toUpperCase();
        renderDashboard();
    } else showView("welcomeView");
}
function renderDashboard() {
    showView("dashboardView");
    document.getElementById("investigatorTag").textContent = appState.investigator.toUpperCase();
    const grid = document.getElementById("caseGrid");
    const cats = [{
        id: "asesinatos", name: "Asesinatos", desc: "Escenas, móviles y reconstrucción de los hechos.", icon: "✦", count: window.CASOS.length
    }];
    const categoryHost = document.getElementById("categoryGrid");
    categoryHost.innerHTML = cats.map(cat => `<div class="col-md-4"><button class="category-card w-100 text-start selected" data-category="${cat.id}"><span class="category-icon">${cat.icon}</span><span class="category-name">${cat.name}</span><span class="category-desc">${cat.desc}</span><span class="category-count">${String(cat.count).padStart(2, "0")} EXPEDIENTES</span></button></div>`).join("");
    categoryHost.querySelectorAll("[data-category]").forEach(btn => btn.addEventListener("click", () => {
        activeCategory = "asesinatos";
        renderDashboard();
    }));
    const filtered = activeCategory ? window.CASOS.filter(c => c.categoria === activeCategory) : [];
    document.getElementById("categoryPrompt").textContent = activeCategory ? `Expedientes de ${cats.find(x => x.id === activeCategory).name}.` : "Elige una modalidad para consultar sus expedientes.";
    document.getElementById("caseGridTitle").textContent = activeCategory ? `Expedientes · ${cats.find(x => x.id === activeCategory).name}` : "Selecciona una investigación";
    document.getElementById("caseGrid").innerHTML = activeCategory ? filtered.map(c => {
        const p = stateFor(c.id), pct = Math.round(p.examined.length / c.evidencias.length * 100);
        return `<div class="col-lg-6"><article class="case-card"><div class="case-art" style="background-image:linear-gradient(#0002,#0009),url('${esc(c.imagen)}')"><span class="case-index">${c.codigo}</span></div><div class="p-4"><div class="eyebrow">INVESTIGACIÓN DE ${esc(c.categoriaNombre)}</div><h2 class="mt-2">${esc(c.titulo)}</h2><p class="text-secondary">${esc(c.descripcion)}</p><div class="d-flex justify-content-between small muted mb-2"><span>${p.examined.length}/${c.evidencias.length} indicios examinados</span><span>${pct}%</span></div><div class="progress mb-3"><div class="progress-bar" style="width:${pct}%"></div></div><button class="btn btn-gold w-100 open-case" data-id="${c.id}">ABRIR EXPEDIENTE →</button></div></article></div>`;
    }).join("") : `<div class="col-12"><div class="panel p-4 text-center"><div class="eyebrow">UNIDAD DE HOMICIDIOS</div><h3 class="mt-2">No hay expedientes disponibles</h3><p class="muted mb-0">Los casos de asesinato aparecerán aquí.</p></div></div>`;
    grid.querySelectorAll(".open-case").forEach(btn => btn.addEventListener("click", () => {
        const found = window.CASOS.find(c => c.id === btn.dataset.id);
        openCase(found);
    }));
    document.getElementById("activityLog").innerHTML = appState.activity.length ? appState.activity.map(a => `<div class="d-flex justify-content-between gap-3 border-bottom border-secondary py-2"><span>${esc(a.message)}</span><span class="text-nowrap">${esc(a.time)}</span></div>`).join("") : "No hay actividad registrada todavía.";
}
function openCase(c) {
    currentCase = c;
    stateFor(c.id);
    document.getElementById("caseCode").textContent = c.codigo;
    document.getElementById("caseHeading").textContent = c.titulo;
    document.getElementById("caseSubheading").textContent = c.subtitulo;
    document.getElementById("caseSceneTitle").textContent = c.escenario;
    document.getElementById("caseSceneDescription").textContent = c.descripcion;
    document.getElementById("caseHero").style.backgroundImage = `linear-gradient(90deg,#101a26f5,#101a26a8),url("${c.imagen}")`;
    showView("caseView");
    renderPhase("brief");
    recordActivity("Abrió " + c.codigo + " · " + c.titulo);
}
function updatePhaseNav(phase) {
    const order = ["brief", "scene", "evidence", "suspects", "interviews", "report"];
    document.querySelectorAll(".phase").forEach(b => {
        const i = order.indexOf(b.dataset.phase);
        b.classList.toggle("active", b.dataset.phase === phase);
        b.classList.toggle("visited", i < order.indexOf(phase));
    });
}
function renderPhase(phase) {
    updatePhaseNav(phase);
    const c = currentCase, p = stateFor(c.id), box = document.getElementById("phaseContent");
    if (phase === "brief") {
        box.innerHTML = `<div class="eyebrow">ETAPA 01 · APERTURA DEL CASO</div><h2 class="mt-2">Resumen del expediente</h2><p class="text-secondary">${esc(c.descripcion)}</p><div class="row g-3 mt-1"><div class="col-md-6"><div class="tile"><div class="code">ESCENARIO</div><h4 class="mt-2">${esc(c.escenario)}</h4><p class="muted mb-0">Tipo de investigación: ${esc(c.tipo)}</p></div></div><div class="col-md-6"><div class="tile"><div class="code">VÍCTIMA</div><h4 class="mt-2">${esc(c.victima.nombre)}</h4><p class="muted mb-1">${esc(c.victima.edad)} años · ${esc(c.victima.ocupacion)}</p><p class="muted mb-0">${esc(c.victima.resumen)}</p></div></div></div><div class="panel p-3 mt-3"><div class="code">CONTEXTO DEL EXPEDIENTE</div><p class="mb-0 mt-2">${esc(c.descripcion)}</p></div>`;
    }
    if (phase === "scene") {
        box.innerHTML = `<div class="eyebrow">ETAPA 02 · INSPECCIÓN DE LA ESCENA</div><h2 class="mt-2">Reconstrucción cronológica</h2><div class="row g-3"><div class="col-lg-6"><img class="w-100 rounded-3" style="max-height:390px;object-fit:cover" src="${esc(c.imagen)}" alt="Escenario ilustrativo del caso"><p class="muted small mt-2">Ilustración conceptual del escenario del expediente.</p></div><div class="col-lg-6"><div class="timeline">${c.cronologia.map(([time, desc]) => `<div class="timeline-item"><b>${esc(time)
            }
        </b><p>${esc(desc)
            }
        </p></div>`).join("")}</div></div></div><button id="markScene" class="btn btn-gold mt-3">${p.sceneReviewed ? "ESCENA REVISADA ✓" : "MARCAR ESCENA COMO REVISADA"}</button>`;
        document.getElementById("markScene").addEventListener("click", () => {
            if (!p.sceneReviewed) {
                p.sceneReviewed = true;
                p.score += 5;
                saveState();
                recordActivity("Inspeccionó la escena de " + c.codigo);
            }
            renderPhase("scene");
        });
    }
    if (phase === "evidence") {
        const filter = document.getElementById("evidenceFilter")?.value || "todos";
        // filter(): permite seleccionar indicios por categoría.
        const list = c.evidencias.filter(e => filter === "todos" || e.tipo.toLowerCase() === filter);
        box.innerHTML = `<div class="eyebrow">ETAPA 03 · ANÁLISIS FORENSE</div><h2 class="mt-2">Evidencias e indicios</h2><div class="row align-items-end mb-3"><div class="col-md-6"><label class="form-label" for="evidenceFilter">Filtrar por categoría</label><select id="evidenceFilter" class="form-select"><option value="todos">Todas las categorías</option>${[...new Set(c.evidencias.map(e => e.tipo.toLowerCase()))].map(t => `<option value="${t}" ${filter === t ? "selected" : ""
            }
        >${t
            }
        </option>`).join("")}</select></div><div class="col-md-6 text-md-end small muted mt-2">${p.examined.length} de ${c.evidencias.length} examinadas</div></div><div class="row g-3">${list.map(e => `<div class="col-md-6 col-xl-4"><article class="tile ${p.examined.includes(e.id) ? "examined" : ""}"><img class="tile-img" src="${esc(e.imagen)}" alt="Ilustración de ${esc(e.nombre)}"><div class="code">${esc(e.id)
                }
        · ${esc(e.tipo)
                }
        </div><h4 class="mt-2">${esc(e.nombre)
                }
        </h4><p class="small muted">${esc(e.descripcion)
                }
        </p><button class="btn btn-sm ${p.examined.includes(e.id) ? "btn-outline-success" : "btn-outline-gold"} inspect" data-id="${e.id}">${p.examined.includes(e.id) ? "INDICIO EXAMINADO ✓" : "EXAMINAR INDICIO"
                }
        </button><div class="analysis small mt-3 ${p.examined.includes(e.id) ? "" : "d-none"}">${esc(e.analisis)
                }
        </div></article></div>`).join("")}</div>`;
        document.getElementById("evidenceFilter").addEventListener("change", () => renderPhase("evidence"));
        box.querySelectorAll(".inspect").forEach(btn => btn.addEventListener("click", () => {
            const ev = c.evidencias.find(e => e.id === btn.dataset.id);
            if (!p.examined.includes(ev.id)) {
                p.examined.push(ev.id);
                p.score += 10;
                saveState();
                recordActivity("Examinó " + ev.id + " en " + c.codigo);
            }
            renderPhase("evidence");
        }));
    }
    if (phase === "suspects") {
        box.innerHTML = `<div class="eyebrow">ETAPA 04 · PERSONAS DE INTERÉS</div><h2 class="mt-2">Perfiles de sospechosos</h2><p class="text-secondary">Analiza el posible móvil, la oportunidad y la información que aporta cada declaración.</p><div class="row g-3">${c.sospechosos.map((s, i) => `<div class="col-md-4"><article class="tile"><img class="suspect-photo" src="${esc(s.foto)}" alt="Retrato ficticio de ${esc(s.nombre)}"><div class="code mt-3">PERFIL ${String(i + 1).padStart(2, "0")
            }
        </div><h4 class="mt-2">${esc(s.nombre)
            }
        </h4><span class="badge text-bg-secondary">${esc(s.rol)
            }
        </span><p class="small muted mt-3"><b>Móvil posible:</b> ${esc(s.motivo)
            }
        </p><p class="small mb-0"><b>Versión:</b> ${esc(s.declaracion)
            }
        </p></article></div>`).join("")}</div>`;
    }
    if (phase === "interviews") {
        box.innerHTML = `<div class="eyebrow">ETAPA 05 · INTERROGATORIOS</div><h2 class="mt-2">Declaraciones y contradicciones</h2><p class="text-secondary">Lee cada respuesta y compárala con los registros objetivos del expediente.</p><div class="accordion" id="interviewAccordion">${c.interrogatorios.map((q, i) => {            
const s = c.sospechosos.find(x => x.id === q.sospechoso), done = p.interviewed.includes(q.sospechoso); return `<div class="accordion-item bg-dark text-light border-secondary mb-2"><h3 class="accordion-header"><button class="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#int${i}">${esc(s.nombre)
                }
        · ${done ? "REVISADO" : "ABRIR INTERROGATORIO"
                }
        </button></h3><div id="int${i}" class="accordion-collapse collapse" data-bs-parent="#interviewAccordion"><div class="accordion-body"><div class="code">PREGUNTA</div><p>${esc(q.pregunta)
                }
        </p><div class="code">RESPUESTA</div><p>${esc(q.respuesta)
                }
        </p><div class="analysis"><b>CONTRASTE DE INVESTIGACIÓN</b><br>${esc(q.observacion)
                }
        </div><button class="btn btn-sm btn-gold mt-3 mark-interview" data-id="${s.id}" ${done ? "disabled" : ""
                }
        >${done ? "DECLARACIÓN REVISADA ✓" : "MARCAR COMO REVISADA"
                }
        </button></div></div></div>`;        
}).join("")}</div>`;
        box.querySelectorAll(".mark-interview").forEach(btn => btn.addEventListener("click", () => {
            if (!p.interviewed.includes(btn.dataset.id)) {
                p.interviewed.push(btn.dataset.id);
                p.score += 15;
                saveState();
                recordActivity("Revisó declaración de " + btn.dataset.id);
            }
            renderPhase("interviews");
        }));
    }
    if (phase === "report") {
        const allE = p.examined.length === c.evidencias.length, allI = p.interviewed.length === c.sospechosos.length;
        const submitted = p.submitted, correct = p.accusation === c.solucion.culpable;
        box.innerHTML = `<div class="eyebrow">ETAPA 06 · ACUSACIÓN E INFORME FINAL</div><h2 class="mt-2">Conclusión del investigador</h2><div class="row g-3 mb-4"><div class="col-md-4"><div class="tile"><div class="code">EVIDENCIAS</div><h3>${p.examined.length}/${c.evidencias.length}</h3><span class="muted small">${allE ? "Inspección completa" : "Revisa todos los indicios"}</span></div></div><div class="col-md-4"><div class="tile"><div class="code">INTERROGATORIOS</div><h3>${p.interviewed.length}/${c.sospechosos.length}</h3><span class="muted small">${allI ? "Todos revisados" : "Hay declaraciones por revisar"}</span></div></div><div class="col-md-4"><div class="tile"><div class="code">PUNTUACIÓN</div><h3>${p.score}</h3><span class="muted small">Puntos de investigación</span></div></div></div>
 ${submitted ? `<div class="${correct ? "result-good" : "result-bad"}"><h3>${correct ? "¡CASO RESUELTO!" : "ACUSACIÓN INCORRECTA"
                }
        </h3><p>Tu elección: <b>${esc(c.sospechosos.find(s => s.id === p.accusation)?.nombre || "Sin selección")
                }
        </b></p><p>Responsable: <b>${esc(c.solucion.nombre)
                }
        </b></p><h5>Reconstrucción lógica</h5><p>${esc(c.solucion.explicacion)
                }
        </p><ol>${c.solucion.secuencia.map(x => `<li class="mb-2">${esc(x)}</li>`).join("")
                }
        </ol><div class="analysis"><b>CIERRE DE LA INVESTIGACIÓN</b><br>La resolución se fundamenta en las evidencias,  los registros y las declaraciones incorporadas a este expediente.</div></div>`:
                `<div class="panel p-3"><h4>¿A quién acusas?</h4><p class="text-secondary small">Selecciona al sospechoso que consideras responsable y fundamenta tu decisión con los indicios.</p><form id="accusationForm"><div class="row g-2">${c.sospechosos.map(s => `<div class="col-md-4"><label class="check-row w-100"><input type="radio" name="accused" value="${s.id}" required><span><b>${esc(s.nombre)}</b><br><small class="muted">${esc(s.rol)}</small></span></label></div>`).join("")
                }
        </div><label class="form-label mt-3" for="reasoning">Fundamentación de la acusación</label><textarea id="reasoning" class="form-control" rows="4" placeholder="Explica qué evidencias y contradicciones respaldan tu conclusión..." required>${esc(p.notes || "")
                }
        </textarea><button class="btn btn-gold mt-3" type="submit">PRESENTAR ACUSACIÓN</button></form></div>`}
 <div class="panel p-3 mt-3"><div class="code">BITÁCORA PERSONAL</div><label class="form-label mt-2" for="personalNotes">Notas del investigador</label><textarea id="personalNotes" class="form-control" rows="3" placeholder="Anota observaciones adicionales...">${esc(p.notes || "")}</textarea><button id="saveNotes" class="btn btn-outline-gold mt-2">GUARDAR NOTAS</button></div>`;
        const form = document.getElementById("accusationForm");
        if (form) form.addEventListener("submit", e => {
            e.preventDefault();
            const data = new FormData(form);
            p.accusation = data.get("accused");
            p.notes = document.getElementById("reasoning").value;
            p.submitted = true;
            p.score += (p.accusation === c.solucion.culpable ? 50 : 5);
            saveState();
            recordActivity("Presentó acusación en " + c.codigo);
            renderPhase("report");
        });
        document.getElementById("saveNotes").addEventListener("click", () => {
            p.notes = document.getElementById("personalNotes").value;
            saveState();
            recordActivity("Guardó notas de " + c.codigo);
            alert("Notas guardadas correctamente.");
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginForm").addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("investigatorName").value.trim();
        if (!name) return;
        appState.investigator = name;
        saveState();
        recordActivity("Acceso autorizado para " + name);
        renderDashboard();
    });
    document.getElementById("homeLink").addEventListener("click", e => {
        e.preventDefault();
        appState.investigator ? renderDashboard() : showView("welcomeView");
    });
    document.getElementById("backBtn").addEventListener("click", renderDashboard);
    document.querySelectorAll(".phase").forEach(btn => btn.addEventListener("click", () => renderPhase(btn.dataset.phase)));

    // Reinicia el progreso guardado, conservando el botón solicitado.
    document.getElementById("resetBtn").addEventListener("click", () => {
        const confirmed = confirm("¿Borrar todo el progreso de este navegador y comenzar de nuevo?");
        if (!confirmed) return;

        localStorage.removeItem(STORAGE_KEY);
        appState = loadState();
        currentCase = null;
        activeCategory = "asesinatos";
        startApp();
    });

    startApp();
});
