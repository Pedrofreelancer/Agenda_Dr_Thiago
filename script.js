
const agenda = document.getElementById('agenda');
const datePicker = document.getElementById('datePicker');
const agendamentosDoDia = document.getElementById('agendamentosDoDia');

const horarios = [
    "08:00", "09:00", "10:00", "11:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
];

function salvarNoLocalStorage(data, hora) {
    const agendaSalva = JSON.parse(localStorage.getItem("agenda")) || {};
    if (!agendaSalva[data]) agendaSalva[data] = [];
    agendaSalva[data].push(hora);
    localStorage.setItem("agenda", JSON.stringify(agendaSalva));
}

function carregarAgenda(dataSelecionada) {
    agenda.innerHTML = '';
    agendamentosDoDia.innerHTML = '';

    const agendaSalva = JSON.parse(localStorage.getItem("agenda")) || {};
    const ocupados = agendaSalva[dataSelecionada] || [];

    horarios.forEach(horario => {
        const btn = document.createElement('button');
        btn.textContent = horario;

        if (ocupados.includes(horario)) {
            btn.classList.add("ocupado");
            btn.disabled = true;
        } else {
            btn.classList.add("livre");
            btn.onclick = () => {
                salvarNoLocalStorage(dataSelecionada, horario);
                carregarAgenda(dataSelecionada);
            };
        }

        agenda.appendChild(btn);
    });

    if (ocupados.length > 0) {
        ocupados.forEach(h => {
            const li = document.createElement('li');
            li.textContent = `${dataSelecionada} às ${h}`;
            agendamentosDoDia.appendChild(li);
        });
    }
}

datePicker.addEventListener("change", () => {
    const dataSelecionada = datePicker.value;
    if (dataSelecionada) {
        carregarAgenda(dataSelecionada);
    }
});
