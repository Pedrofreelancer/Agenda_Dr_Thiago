
const agenda = document.getElementById("agenda");
const datePicker = document.getElementById("datePicker");
const agendamentosDoDia = document.getElementById("agendamentosDoDia");

const formContainer = document.getElementById("form-container");
const nomePacienteInput = document.getElementById("nomePaciente");
const confirmarBtn = document.getElementById("confirmarAgendamento");
const cancelarFormBtn = document.getElementById("cancelarFormulario");
const horarioSelecionadoSpan = document.getElementById("horarioSelecionado");

let horarioSelecionado = "";
let dataSelecionada = "";

function gerarHorarios() {
  const horarios = [];
  let hora = 7;
  let minuto = 0;
  while (hora < 18 || (hora === 17 && minuto <= 30)) {
    const h = String(hora).padStart(2, "0");
    const m = String(minuto).padStart(2, "0");
    horarios.push(`${h}:${m}`);
    minuto += 30;
    if (minuto === 60) {
      minuto = 0;
      hora++;
    }
  }
  return horarios;
}

const horarios = gerarHorarios();

function salvarNoLocalStorage(data, agendamento) {
  const agendaSalva = JSON.parse(localStorage.getItem("agenda")) || {};
  if (!agendaSalva[data]) agendaSalva[data] = [];
  agendaSalva[data].push(agendamento);
  localStorage.setItem("agenda", JSON.stringify(agendaSalva));
}

function cancelarAgendamento(data, index) {
  const agendaSalva = JSON.parse(localStorage.getItem("agenda")) || {};
  if (agendaSalva[data]) {
    agendaSalva[data].splice(index, 1);
    localStorage.setItem("agenda", JSON.stringify(agendaSalva));
    carregarAgenda(data);
  }
}

function mostrarFormulario(horario) {
  horarioSelecionado = horario;
  horarioSelecionadoSpan.textContent = horario;
  nomePacienteInput.value = "";
  formContainer.style.display = "block";
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

confirmarBtn.onclick = () => {
  const nome = nomePacienteInput.value.trim();
  if (nome && dataSelecionada && horarioSelecionado) {
    salvarNoLocalStorage(dataSelecionada, {
      hora: horarioSelecionado,
      nome: nome
    });
    formContainer.style.display = "none";
    carregarAgenda(dataSelecionada);
  }
};

cancelarFormBtn.onclick = () => {
  formContainer.style.display = "none";
};

function carregarAgenda(data) {
  dataSelecionada = data;
  agenda.innerHTML = "";
  agendamentosDoDia.innerHTML = "";

  const agendaSalva = JSON.parse(localStorage.getItem("agenda")) || {};
  const agendados = agendaSalva[data] || [];

  horarios.forEach((horario) => {
    const ocupado = agendados.find((ag) => ag.hora === horario);
    const btn = document.createElement("button");

    btn.textContent = horario;
    if (ocupado) {
      btn.classList.add("ocupado");
      btn.disabled = true;
    } else {
      btn.classList.add("livre");
      btn.onclick = () => mostrarFormulario(horario);
    }

    agenda.appendChild(btn);
  });

  agendados.forEach((agendamento, i) => {
    const li = document.createElement("li");
    li.textContent = `${agendamento.hora} - ${agendamento.nome}`;
    const cancelarBtn = document.createElement("button");
    cancelarBtn.textContent = "Cancelar";
    cancelarBtn.classList.add("cancelar-btn");
    cancelarBtn.onclick = () => cancelarAgendamento(data, i);
    li.appendChild(cancelarBtn);
    agendamentosDoDia.appendChild(li);
  });
}

datePicker.addEventListener("change", () => {
  const data = datePicker.value;
  if (data) {
    carregarAgenda(data);
  }
});
