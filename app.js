let habits = JSON.parse(localStorage.getItem('habits')) || [];
let checks = JSON.parse(localStorage.getItem('checks')) || {};
let weekOffset = 0;


  function save() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('checks', JSON.stringify(checks));
  }

  
  function getWeekDates(offset) {
    const today = new Date();
    const day = today.getDay();
    const sinceMonday = (day + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - sinceMonday + offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  function isoDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function isToday(d) {
    return isoDate(d) === isoDate(new Date());
  }

  function isFuture(d) {
    const today = new Date();
    today.setHours(0,0,0,0);
    return d > today;
  }
  function calcStreak(habitId) {
    let streak = 0;
    let d = new Date();
    d.setHours(0,0,0,0);
    if (!checks[`${habitId}_${isoDate(d)}`]) {
      d.setDate(d.getDate() - 1);
    }
    while (checks[`${habitId}_${isoDate(d)}`]) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }  
  function updateWeekLabel() {
    const dates = getWeekDates(weekOffset);
    const opts = { month: 'short', day: 'numeric' };
    const start = dates[0].toLocaleDateString('en-US', opts);
    const end = dates[6].toLocaleDateString('en-US', opts);
    const year = dates[6].getFullYear();
    document.getElementById('date').textContent = `${start} - ${end}, ${year}`;
  }

  
  function render() {
    updateWeekLabel();
    const dates = getWeekDates(weekOffset);
    const tbody = document.querySelector('.habit-table tbody');
    tbody.innerHTML = '';

    if (habits.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align:center; padding:4rem; color:#888; font-size:1.5rem;">
            No habits yet — add one above!
          </td>
        </tr>`;
      return;
    }

    habits.forEach(habit => {
      const streak = calcStreak(habit.id);
      const tr = document.createElement('tr');

      let cells = `<td class="habit-name">${habit.name}</td>`;

    
      cells += `<td class="streak">
        <span class="streak-icon"><i class="fa-solid fa-fire"></i></span>
        ${streak > 0 ? `<strong>${streak}</strong>` : ''} Days
      </td>`;

      
      dates.forEach(d => {
        const key = `${habit.id}_${isoDate(d)}`;
        const checked = checks[key] ? 'checked' : '';
        const disabled = isFuture(d) ? 'disabled' : '';
        const todayStyle = isToday(d) ? 'style="background:#f6fbf7"' : '';
        cells += `<td ${todayStyle}>
          <button class="check-btn ${checked}" 
            data-habit="${habit.id}" 
            data-date="${isoDate(d)}"
            ${disabled}>
          </button>
        </td>`;
      });

      
      cells += `<td>
        <button class="rename-btn in-table-btn" data-id="${habit.id}">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="remove-btn in-table-btn" data-id="${habit.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>`;

      tr.innerHTML = cells;
      tbody.appendChild(tr);
    });

  
    document.querySelectorAll('.check-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = `${btn.dataset.habit}_${btn.dataset.date}`;
        if (checks[key]) {
          delete checks[key];
        } else {
          checks[key] = true;
        }
        save();
        render();
      });
    });

  
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this habit?')) {
          const id = btn.dataset.id;
          habits = habits.filter(h => h.id !== id);
          Object.keys(checks).forEach(k => {
            if (k.startsWith(id)) delete checks[k];
          });
          save();
          render();
        }
      });
    });


    document.querySelectorAll('.rename-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const habit = habits.find(h => h.id === id);
        const newName = prompt('Rename habit:', habit.name);
        if (newName && newName.trim()) {
          habit.name = newName.trim();
          save();
          render();
        }
      });
    });
  }


  document.querySelector('.add-btn').addEventListener('click', () => {
    const input = document.querySelector('.input-box');
    const name = input.value.trim();
    if (!name) return;
    habits.push({
      id: 'h_' + Date.now(),
      name: name
    });
    save();
    render();
    input.value = '';
  });

 
  document.querySelector('.input-box').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.querySelector('.add-btn').click();
  });

 
  document.getElementById('previous-btn').addEventListener('click', () => {
    weekOffset--;
    render();
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    if (weekOffset < 0) { weekOffset++; render(); }
  });

  document.querySelector('.today-btn').addEventListener('click', () => {
    weekOffset = 0;
    render();
  });

 
  render();
