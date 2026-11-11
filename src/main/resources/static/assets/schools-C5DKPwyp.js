import"./style-CqqmwaoU.js";async function d(){const e=document.querySelector("#schoolTable tbody");if(e)try{const t=await fetch("http://localhost:8080/api/schools");if(!t.ok)throw new Error(`Chyba při načítání: ${t.statusText}`);const r=await t.json();if(e.innerHTML="",r.length===0){e.innerHTML='<tr><td colspan="4">Zatím neexistují žádné školy.</td></tr>';return}r.forEach(n=>{const o=document.createElement("tr");o.innerHTML=`
                <td>${n.id}</td>
                <td>${a(n.name)}</td>
                <td>${a(n.city)}</td>
                <td>${n.teamCount??"-"}</td>
            `,e.appendChild(o)})}catch(t){console.error("Error fetching schools:",t),e.innerHTML='<tr><td colspan="4" class="error">Nepodařilo se načíst data ze serveru.</td></tr>'}}function a(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}document.addEventListener("DOMContentLoaded",d);
