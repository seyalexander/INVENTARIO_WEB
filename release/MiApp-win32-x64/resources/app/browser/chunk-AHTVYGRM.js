import{a}from"./chunk-7KPXEIKL.js";import{a as o}from"./chunk-T6WYW2DS.js";import{b as s}from"./chunk-UFZ5HBZB.js";import{Z as e,ca as r}from"./chunk-P2XP77ST.js";var c=(()=>{class i extends o{ListarUsuarios(){return this.httpClient.get(`${this.URL}/ObtenerUsuarios`,{headers:{"Content-Type":"application/json"}})}login(t){return this.httpClient.post(`${this.URL}/Login`,t,{headers:{"Content-Type":"application/json"}})}newUsuario(t){return this.httpClient.post(`${this.URL}/RegistrarUsuario`,t)}detalleUsuario(t){return this.httpClient.post(`${this.URL}/UsuarioById`,t,{headers:{"Content-Type":"application/json"}})}actualizarUsuario(t){return this.httpClient.post(`${this.URL}/ActualizarUsuario`,t,{headers:{"Content-Type":"application/json"}})}actualizarEstadoUsuario(t){return this.httpClient.post(`${this.URL}/ActualizarUsuario`,t,{headers:{"Content-Type":"application/json"}})}constructor(t){super(),this.httpClient=t,this.URL=a.api}static{this.\u0275fac=function(n){return new(n||i)(r(s))}}static{this.\u0275prov=e({token:i,factory:i.\u0275fac,providedIn:"root"})}}return i})();export{c as a};
