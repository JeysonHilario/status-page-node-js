let pingValueIsptec       = 0;
let uploadValueIsptec     = 0; 
let downloadValueIsptec   = 0;

let pingValueProxxima     = 0;
let uploadValueProxiima   = 0;
let downloadValueProxxima = 0;

let pingWatchTv           = 0;
let pingDNSGoogle         = 0;
let pingEpicGames         = 0;
let pingInstagram         = 0;
let pingFacebook          = 0;
let pingWhatsapp          = 0;
let pingYoutube           = 0;

const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:2828/status/borda"); // Faz a requisição
    const data = await response.json(); // Converte o JSON recebido
    return data; // Retorna os dados
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
  }
};

const main = async () => {
  const result  = await fetchData();

  pingValueIsptec       = result.PingIsptec       || 0 ;
  uploadValueIsptec     = result.UploadIsptec     || 0 ;
  downloadValueIsptec   = result.DownloadIsptec   || 0;

  pingValueProxxima     = result.PingProxxima     || 0 ;
  uploadValueProxiima   = result.UploadProxxima   || 0 ;
  downloadValueProxxima = result.DownloadProxxima || 0;

  checkPing(pingValueProxxima,"proxxima");
  checkPing(pingValueIsptec,"isptec");
  
  pingWatchTv        = result.PingWatch     || 20.6;
  pingDNSGoogle      = result.pingDNSGoogle || 0;
  pingEpicGames      = result.pingEpicGames || 0;
  pingInstagram      = result.pingInstagram || 0;
  pingFacebook       = result.pingFacebook  || 0;
  pingWhatsapp       = result.pingWhatsapp  || 0;
  pingYoutube        = result.pingYoutube   || 0;

};

async function checkPing(ping, link){
  if( ping === 0){
    document.getElementById(`status-${link}`).innerText = "Link inoperante 🔴";
  }else{
    document.getElementById(`status-${link}`).innerText = "Link Operacional 🟢";
  }
}

async function refreshElements(){

  document.getElementById('pingIsptec').innerText = `${pingValueIsptec}`;
  document.getElementById('uploadIsptec').innerText = `${uploadValueIsptec}`; 
  document.getElementById('downloadIsptec').innerText = `${downloadValueIsptec}`;
  document.getElementById('pingProxxima').innerText = `${pingValueProxxima}`;
  document.getElementById('uploadProxxima').innerText = `${uploadValueProxiima}`; 
  document.getElementById('downloadProxxima').innerText = `${downloadValueProxxima}`;
  
  document.getElementById('pingWatch').innerText = `${pingWatchTv} ms`;
  document.getElementById('pingDNSGoogle').innerText = `${pingDNSGoogle}`;
  document.getElementById('pingEpicGames').innerText = `${pingEpicGames}`;
  document.getElementById('pingInstagram').innerText = `${pingInstagram}`;
  document.getElementById('pingFacebook').innerText  = `${pingFacebook}`;
  document.getElementById('pingWhatsapp').innerText  = `${pingWhatsapp}`;
  document.getElementById('pingYoutube').innerText  = `${pingYoutube}`;

}
setInterval(async () => {
  await main();
  refreshElements();
}, 10000);

(async () => { 
  await main();       
  refreshElements();  
})();
