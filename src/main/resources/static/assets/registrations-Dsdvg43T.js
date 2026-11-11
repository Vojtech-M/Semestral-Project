import"./style-CqqmwaoU.js";async function d(){const e=document.querySelector("#regTable tbody");if(e)try{const t=await fetch("http://localhost:8080/api/registrations");if(!t.ok)throw new Error(`Chyba při načítání: ${t.statusText}`);const a=await t.json();if(e.innerHTML="",a.length===0){e.innerHTML='<tr><td colspan="5">Zatím neexistují žádné registrace.</td></tr>';return}a.forEach(n=>{const o=document.createElement("tr"),s=new Date(n.createdAt).toLocaleDateString("cs-CZ");o.innerHTML=`
                <td>${n.id}</td>
                <td>${r(n.teamName)}</td>
                <td>${r(n.school)}</td>
                <td><span class="status-badge status-${n.status.toLowerCase()}">${r(n.status)}</span></td>
                <td>${s}</td>
            `,e.appendChild(o)})}catch(t){console.error("Errror fetching registrations:",t),e.innerHTML='<tr><td colspan="5" class="error">Nepodařilo se načíst data z serveru.</td></tr>'}}function r(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}document.addEventListener("DOMContentLoaded",d);
