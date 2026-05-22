function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getWeekDates(offset) {
  const today = new Date();
  const sinceMonday = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - sinceMonday + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
let weekOffset = 0;

let pendingDeleteId = null;
let habits = JSON.parse(localStorage.getItem('habits')) || []; 
let checks = JSON.parse(localStorage.getItem('checks')) || {}; 

function save() {
    localStorage.setItem('habits', JSON.stringify(habits));
     localStorage.setItem('checks', JSON.stringify(checks));
}
function updateWeekLabel() {
  const dates = getWeekDates(weekOffset);
  const opts = { month: 'short', day: 'numeric' };
  const start = dates[0].toLocaleDateString('en-US', opts);
  const end = dates[6].toLocaleDateString('en-US', opts);
  const year = dates[6].getFullYear();
  document.getElementById('date').textContent = `${start} - ${end}, ${year}`;
}

function highlightToday() {
  const dates = getWeekDates(weekOffset);
  const todayISO = isoDate(new Date());
  const headers = document.querySelectorAll('.habit-table thead th');
  headers.forEach((th, i) => {
    if (i >= 2 && i <= 8) { // day columns only
      th.classList.remove('today-col');
      if (isoDate(dates[i - 2]) === todayISO) {
        th.classList.add('today-col');
      }
    }
  });
}
function calcStreak(habitId) {
  let streak = 0;
  let d = new Date();
  d.setHours(0, 0, 0, 0);

  
  if (!checks[`${habitId}_${isoDate(d)}`]) {
    d.setDate(d.getDate() - 1);
  }

  
  while (checks[`${habitId}_${isoDate(d)}`]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return streak;
}

function render() {
    updateWeekLabel();
    highlightToday();
    const tbody = document.querySelector('.habit-table tbody');
    tbody.innerHTML = '';
    if (habits.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="empty-state">
          <div class="empty-wrapper">
            <div class="empty-icon">🌱</div>
                <p class="empty-title">No habits yet</p>
              <p class="empty-subtitle">Start by adding something small you want to do every day</p>
          </div>
        </td>
      </tr>`;
  return;
}

    habits.forEach(habit => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="habit-name">${habit.name}</td>
        
        <td class="streak"><i class="fa-solid fa-fire streak-icon"></i> ${calcStreak(habit.id)} days</td>
        ${getWeekDates(weekOffset).map(d =>
           `<td ${isoDate(d) === isoDate(new Date()) ? 'class="today-col"' : ''}>
           <button class="check-btn" data-habit="${habit.id}" data-date="${isoDate(d)}"></button>
           </td>`).join('')}
        
           <td>
         <button class="rename-btn in-table-btn" data-id="${habit.id}"><i class="fa-solid fa-pen"></i>
          </button>
          <button class="remove-btn in-table-btn" data-id="${habit.id}"><i class="fa-solid fa-trash"></i>
          </button>
        </td>`;
      tbody.appendChild(tr);
    });
  document.querySelectorAll('.check-btn').forEach(btn => {

      const key = `${btn.dataset.habit}_${btn.dataset.date}`;
      

      
      if (checks[key]) {
        btn.classList.add('checked');
      }
      btn.addEventListener('click', () => {
        const d = new Date(btn.dataset.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (d > today) return; 
        
        const k = `${btn.dataset.habit}_${btn.dataset.date}`;
        if (checks[k]){
          delete checks[k];
        } 
        else{
          checks[k] = true;
        }
        save();
        render();
      });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    const habit = habits.find(h => h.id === id);
    pendingDeleteId = id;
    document.getElementById('modal-subtitle').textContent = 
      `"${habit.name}" and all its history will be deleted.`;
    document.getElementById('modal-overlay').classList.add('active');
  });
});
    document.querySelectorAll('.rename-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const habit = habits.find(h => h.id === id);

        
        const row = btn.closest('tr');
        const nameCell = row.querySelector('.habit-name');

        nameCell.innerHTML = `
          <input type="text" class="rename-input" value="${habit.name}"maxlength="60"/>`;
        const input = nameCell.querySelector('.rename-input');
        input.focus();
        input.select();

       
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') input.blur();
        });

       
        input.addEventListener('blur', () => {
          const newName = input.value.trim();
          if (newName && newName !== habit.name) {
            habit.name = newName;
            save();
          }
          render(); 
        });
      });
    });


}

document.querySelector('.add-btn').addEventListener('click', () => {
    const input = document.querySelector('.input-box');
    const name = input.value.trim();
    if (!name) return;
    habits.push({ id:'x_' +  Date.now(),
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
  if (weekOffset < 0) {
    weekOffset++;
    render();
  }
});
document.getElementById('today-btn').addEventListener('click', () => {
  weekOffset = 0;
  render();
});
document.getElementById('modal-cancel').addEventListener('click', () => {
  document.getElementById('modal-overlay').classList.remove('active');
  pendingDeleteId = null;
});

document.getElementById('modal-delete').addEventListener('click', () => {
  if (!pendingDeleteId) return;
  habits = habits.filter(h => h.id !== pendingDeleteId);
  Object.keys(checks).forEach(key => {
    if (key.startsWith(pendingDeleteId + '_')) delete checks[key];
  });
  save();
  render();
  document.getElementById('modal-overlay').classList.remove('active');
  pendingDeleteId = null;
});

render();
