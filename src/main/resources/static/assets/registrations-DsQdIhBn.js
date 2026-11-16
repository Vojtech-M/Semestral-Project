import"./style-TQwKDJG-.js";async function c(e,t){try{const n=await fetch(`http://localhost:8080/api/registrations/${e}/status`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:t})});if(!n.ok)throw new Error(`Chyba při změně statusu: ${n.statusText}`);await r()}catch(n){console.error("Error updating status:",n),alert("Nepodařilo se změnit status registrace.")}}async function r(){const e=document.querySelector("#regTable tbody");if(e)try{const t=await fetch("http://localhost:8080/api/registrations");if(!t.ok)throw new Error(`Chyba při načítání: ${t.statusText}`);const n=await t.json();if(e.innerHTML="",n.length===0){e.innerHTML='<tr><td colspan="6">Zatím neexistují žádné registrace.</td></tr>';return}n.forEach(a=>{const s=document.createElement("tr"),i=new Date(a.createdAt).toLocaleDateString("cs-CZ");s.innerHTML=`
                <td>${a.id}</td>
                <td>${o(a.teamName)}</td>
                <td>${o(a.school)}</td>
                <td><span class="status-badge status-${a.status.toLowerCase()}">${o(a.status)}</span></td>
                <td>${i}</td>
                <td>
                    <button class="btn-approve" onclick="window.updateStatus(${a.id}, 'VALID')">Schválit</button>
                    <button class="btn-reject" onclick="window.updateStatus(${a.id}, 'EXPIRED')">Zamítnout</button>
                </td>
            `,e.appendChild(s)})}catch(t){console.error("Errror fetching registrations:",t),e.innerHTML='<tr><td colspan="6" class="error">Nepodařilo se načíst data z serveru.</td></tr>'}}window.updateStatus=c;function o(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}document.addEventListener("DOMContentLoaded",r);
