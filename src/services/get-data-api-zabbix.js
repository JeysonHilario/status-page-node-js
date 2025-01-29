import dotenv from "dotenv"
import axios from "axios"
dotenv.config();

export const ID_BORDA = 10517;
export const ID_BRAS  = 10604;
export const bitsSentProxxima     = 61986;
export const bitsReceivedProxxima = 61985;
export const pingGatewayProxxima  = 62243;

export const bitsSentIsptec     = 42978;
export const bitsReceivedIsptec = 42942;
export const pingGatewayIsptec  = 62257;

export const pingDnsGoogle  = 59176;
export const pingEpicGames  = 59179;
export const pingIstagram   = 62102;
export const pingFacebook   = 62111;
export const pingWhatsapp   = 62120;
export const pingYoutube    = 62129;

let cachedToken = null;
let tokenTimeStamp = null;
const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000;


async function getToken(){

  const now = Date.now();
  if (cachedToken && tokenTimeStamp && now - tokenTimeStamp < TOKEN_EXPIRATION_TIME){
    return cachedToken;
  }
  const authToken = await axios.post(process.env.zabbixUrl, {
    jsonrpc: "2.0",
    method: "user.login",
    params: {
      user: process.env.ZABBIX_USER,
      password: process.env.ZABBIX_PASSWORD,
    },
    id: 1
  }
  );
  cachedToken = authToken.data.result;
  tokenTimeStamp = now;

  return cachedToken;
}


async function formatBitsPerSecond(bps) {
  if (bps >= 1e9) {
    return (bps / 1e9).toFixed(2) + ' Gbps';
  } else if (bps >= 1e6) {
    return (bps / 1e6).toFixed(2) + ' Mbps';
  } else if (bps >= 1e3) {
    return (bps / 1e3).toFixed(2) + ' Kbps';
  } else {
    return bps + ' bps';
  }
};

export async function getPingResponse(hostid,itemid){
  
  const Token = await getToken();
  let data = {
    jsonrpc: "2.0",
    method: "item.get",
    params: {
      hostids: hostid,
      //itemids: itemid,
      filter: {
        "name": "ICMP response time"  // Ou o nome do item que está monitorando o tempo de resposta
      },
      output: ["lastvalue"]
    },
    auth: Token,
    id: 2
  };
  
  const response = await axios.post(process.env.zabbixUrl,data);
  let pingms = response.data.result[0].lastvalue * 1000;
  let ping = Math.trunc(pingms * 100) / 100 ;
  return `${ping} ms`;
};

export async function getDataRate(hostid, itemid){
  
  const Token = await getToken();

  let data = {
    jsonrpc: "2.0",
    method: "item.get",
    params: {
      hostids: hostid,
      itemids: itemid,
      output: "extend"
    },
    auth: Token,
    id: 2
  };
  
  try {
    let response = await axios.post(process.env.zabbixUrl,data);
    if (response.data.error) {
      console.error("Erro na API do Zabbix:", response.data.error);
      return "Erro ao obter dados";
    }

    if (!response.data.result || response.data.result.length === 0) {
      console.warn("Nenhum dado retornado da API do Zabbix.");
      return "Sem dados disponíveis";
    }
    
    const mbs = await formatBitsPerSecond(response.data.result[0].lastvalue);
    return mbs;
  } catch (error) {
    console.error("Erro ao se comunicar com a API do Zabbix:", error);
    return "Erro na requisição";
  }

};

export async function getPingGateway(hostid, itemid){
 	
  const Token = await getToken();

  let data = {
    jsonrpc: "2.0",
    method: "item.get",
    params: {
      hostids: hostid,
      itemids: itemid,
      output: "extend"
    },
    auth: Token,
    id: 2
  };
  
  try {
    let response = await axios.post(process.env.zabbixUrl,data);
    if (response.data.error) {
      console.error("Erro na API do Zabbix:", response.data.error);
      return "Erro ao obter dados";
    }

    if (!response.data.result || response.data.result.length === 0) {
      console.warn("Nenhum dado retornado da API do Zabbix.");
      return "Sem dados disponíveis";
    }
    
    const ping = response.data.result[0].lastvalue    
    return `${ping} ms`;
  } catch (error) {
    console.error("Erro ao se comunicar com a API do Zabbix:", error);
    return "Erro na requisição";
  }
}
export async function getHostsId(){
  
  const Token = await getToken();
  let data = { 
    jsonrpc: "2.0", 
    method: "host.get",
    params: {  
      output: ["hostid","host"]
    },  
    auth: Token,  
    id: 2  
  };
     
  const response = await axios.post(process.env.zabbixUrl,data);

  console.log(response.data.result);
}    
    
export async function getHostsItens(hostid, itemName = ""){
      
  const Token = await getToken();
  let data = {    
    jsonrpc: "2.0",    
    method: "item.get",
    params: {    
      hostids: hostid, 
      search: {    
        "name":  itemName // Ou o nome do item que está monitorando o tempo de resposta
      },    
      output: ["itemid","name"]
    },    
    auth: Token,    
    id: 2    
  };    
      
  const response = await axios.post(process.env.zabbixUrl,data);
  console.log(response.data.result)
}    

export async function getAllData(hostid, itemIdUpIsptec, itemIdDownIsptec, itemIdPingIsptec, itemIdUpProxxima, itemIdDownProxxima, itemIdPingProxxima){
  let json = {

    UploadIsptec:     `${await getDataRate(hostid,itemIdUpIsptec)}`,
    DownloadIsptec:   `${await getDataRate(hostid,itemIdDownIsptec)}`,
    PingIsptec:       `${await getPingGateway(hostid,itemIdPingIsptec)}`,
    UploadProxxima:   `${await getDataRate(hostid,itemIdUpProxxima)}`,
    DownloadProxxima: `${await getDataRate(hostid,itemIdDownProxxima)}`,
    PingProxxima:     `${await getPingGateway(hostid,itemIdPingProxxima)}`,
    pingDNSGoogle:    `${await getPingResponse(10616)}`,
    pingEpicGames:    `${await getPingResponse(10617)}`,
    pingInstagram:    `${await getPingResponse(10624)}`,
    pingFacebook:     `${await getPingResponse(10625)}`,
    pingWhatsapp:     `${await getPingResponse(10626)}`,
    pingYoutube:      `${await getPingResponse(10627)}`
  };
  return json;
}
/*const data = {    
    jsonrpc: "2.0",    
    method: "host.get",
    params: {    
      //hostids: "10517",
      //itemids: "42759",
      output: ["hostid","host"]
      //filter: {    
        //"name": "ICMP response time"  // Ou o nome do item que está monitorando o tempo de resposta
        //"name": "Interface vlan1134-IPV4(VLAN-UPSTREAM-PROXXIMA): Speed"  // Ou o nome do item que está monitorando o tempo de resposta
      //},    
      //search: {    
        //    name: "sfp1"
       // },    
    
    },    
    auth: authToken.data.result,
    id: 2   
};*/  
  
//getPingResponse();
//getDataRate(TOKEN,,bitsReceivedProxximaBorda,process.env.zabbixUrl);
//getDataRate(10517,bitsSentProxximaBorda,process.env.zabbixUrl);
//getHostsId()
//getHostsItens(10627,"Ping",process.env.zabbixUrl)
//console.log(JSON.stringify(response.data.result).)
//getPingGateway(10517,62243);
  
//getPingResponse(10627)
  // { hostid: '10616', host: 'DNS-GOOGLE' }, 59176
  // { hostid: '10617', host: 'EPIC-GAMES' }, 59179
  // { hostid: '10624', host: 'INSTAGRAM' },  62102
  // { hostid: '10625', host: 'FACEBOOK' },   62111 
  // { hostid: '10626', host: 'WHATSAPP' },   62120
  // { hostid: '10627', host: 'YOUTUBE' }     62129
