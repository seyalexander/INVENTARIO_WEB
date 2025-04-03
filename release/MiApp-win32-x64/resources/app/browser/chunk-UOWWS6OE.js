import{a as A}from"./chunk-AHTVYGRM.js";import{c as y}from"./chunk-AMMCLHNQ.js";import{a as C,b as u,d as S,e as E,j as M,l as w,m as k,q as F,r as D,s as _,t as q}from"./chunk-DS4W2E5P.js";import"./chunk-7KPXEIKL.js";import"./chunk-T6WYW2DS.js";import"./chunk-UFZ5HBZB.js";import{Ab as t,B as g,Bb as r,Cb as a,Jb as x,Jc as h,Tb as i,Vb as v,Ya as m,Za as c,ac as l,ja as s,l as p,qb as b,tb as f}from"./chunk-P2XP77ST.js";import"./chunk-P2VZOJAX.js";var P=(()=>{class o{constructor(n,e,d){this.formBuilder=n,this.seguridadService=e,this.router=d,this.claseErrorVisible="alert alert-danger mx-4 hidden",this.requestLogin={},this.loginForm=this.formBuilder.group({rucempresa:["",[u.required]],idUsuario:["",[u.required]],contrasenia:["",[u.required]]}),this.errorMessage=""}get ruc(){return this.loginForm.controls.rucempresa}get idUsuario(){return this.loginForm.controls.idUsuario}get contrasenia(){return this.loginForm.controls.contrasenia}onSubmit(){if(this.loginForm.invalid){this.claseErrorVisible="alert alert-danger mx-4",this.errorMessage="Por favor complete todos los campos.";return}let n=this.requestLogin;n.rucempresa=this.ruc.value?.trim()??"",n.idusuario=this.idUsuario.value?.trim()??"",n.contrasenia=this.contrasenia.value?.trim()??"",this.seguridadService.login(n).pipe(g(e=>(this.errorMessage="Credenciales incorrectas o problema de red.",p(null)))).subscribe({next:e=>{e?.exito&&(e?.cargo=="Administrador"||e?.cargo=="Administrador".toUpperCase()||e?.cargo=="Administrador".toLowerCase()?(sessionStorage.setItem("user",e?.idusuario),sessionStorage.setItem("admin",e?.nombreusuario),this.router.navigate(["/dashboard"])):(this.claseErrorVisible="alert alert-danger mx-4",this.errorMessage="No cuenta con permiso para ingresar",this.router.navigate(["/login"]))),e?.exito||(this.claseErrorVisible="alert alert-danger mx-4",this.errorMessage=`${e?.msgerror}`,this.router.navigate(["/login"]))},error:()=>{this.router.navigate(["/login"])}})}clearErrorMessage(){this.errorMessage=""}static{this.\u0275fac=function(e){return new(e||o)(c(D),c(A),c(y))}}static{this.\u0275cmp=s({type:o,selectors:[["apartado-derecho"]],standalone:!0,features:[l],decls:28,vars:4,consts:[[1,"p-4","sm:p-7"],[1,"text-center"],[1,"block","text-2xl","font-bold","text-gray-800"],[1,"mt-2","text-sm","text-gray-600"],[1,"mt-1"],[3,"ngSubmit","formGroup"],[1,"grid","gap-y-4"],["for","rucempresa",1,"block","text-sm","mb-2"],[1,"relative"],["type","text","id","rucempresa","formControlName","rucempresa","required","","aria-describedby","rucempresa-error",1,"py-2","px-4","block","w-full","border","border-gray-200","rounded-lg","text-sm","focus:border-blue-500","focus:ring-blue-500","disabled:opacity-50","disabled:pointer-events-none"],["for","username",1,"block","text-sm","mb-2"],["type","text","id","username","formControlName","idUsuario","required","","aria-describedby","username-error",1,"py-2","px-4","block","w-full","border","border-gray-200","rounded-lg","text-sm","focus:border-blue-500","focus:ring-blue-500","disabled:opacity-50","disabled:pointer-events-none"],["for","password",1,"block","text-sm","mb-2"],["type","password","id","password","formControlName","contrasenia","required","","aria-describedby","password-error",1,"py-2","px-4","block","w-full","border","border-gray-200","rounded-lg","text-sm","focus:border-blue-500","focus:ring-blue-500","disabled:opacity-50","disabled:pointer-events-none"],["type","submit",1,"w-full","py-3","px-4","inline-flex","justify-center","items-center","gap-x-2","text-sm","font-medium","rounded-lg","border","border-transparent","bg-blue-600","text-white","hover:bg-blue-700","focus:outline-none","focus:bg-blue-700","disabled:opacity-50","disabled:pointer-events-none"],["role","alert"]],template:function(e,d){e&1&&(t(0,"div",0)(1,"div",1)(2,"h1",2),i(3," Login "),r(),t(4,"p",3),i(5," Ingresa a tu sistema de control de inventario "),r()(),t(6,"div",4)(7,"form",5),x("ngSubmit",function(){return d.onSubmit()}),t(8,"div",6)(9,"div")(10,"label",7),i(11,"RUC Empresa"),r(),t(12,"div",8),a(13,"input",9),r()(),t(14,"div")(15,"label",10),i(16,"Usuario"),r(),t(17,"div",8),a(18,"input",11),r()(),t(19,"div")(20,"label",12),i(21,"Contrase\xF1a"),r(),t(22,"div",8),a(23,"input",13),r()(),t(24,"button",14),i(25," Ingresar "),r()()()()(),t(26,"div",15),i(27),r()),e&2&&(m(7),b("formGroup",d.loginForm),m(19),f(d.claseErrorVisible),m(),v(" ",d.errorMessage,`
`))},dependencies:[q,M,C,S,E,F,w,k,_,h]})}}return o})();var z=(()=>{class o{static{this.\u0275fac=function(e){return new(e||o)}}static{this.\u0275cmp=s({type:o,selectors:[["apartado-izquierdo"]],standalone:!0,features:[l],decls:11,vars:0,consts:[["src","../../../../../../assets/svg/icon-logo-DbInventory.svg","alt",""],[1,"text-4xl","p-2","text-gray-100","text-left"],[1,"text-decoration"],[1,"rslt-text"],[1,"text-white","mt-4"],[1,"mt-5","border-2","px-5","py-1","text-gray-100","rounded-md","hover:text-[#00D1AE]","hover:border-[#00D1AE]"]],template:function(e,d){e&1&&(a(0,"img",0),t(1,"h2",1),i(2," Haz tus "),t(3,"span",2)(4,"span",3),i(5,"inventarios"),r()(),i(6,` m\xE1s din\xE1micos y flexibles
`),r(),t(7,"p",4),i(8,` Adapta tu Estrategia Log\xEDstica a los nuevos retos digitales\u200B
`),r(),t(9,"button",5),i(10,` DB PERU
`),r())},styles:['.bg-fondo-login[_ngcontent-%COMP%]{width:100%;background-image:url("./media/bg_fondo-CXGFOBCI.webp");object-fit:contain;background-position:center;background-size:cover}.rslt-text[_ngcontent-%COMP%]{background:linear-gradient(var(--color-principal-3) 0 100%) 0 / 100% calc(var(--line-height) / 1) no-repeat;-webkit-box-decoration-break:clone;line-height:var(--line-height);padding-bottom:20px}.text-decoration[_ngcontent-%COMP%]{position:relative;z-index:1}.text-decoration[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{position:absolute;right:-5px;bottom:8px;z-index:-1}']})}}return o})();var H=(()=>{class o{static{this.\u0275fac=function(e){return new(e||o)}}static{this.\u0275cmp=s({type:o,selectors:[["app-login-page"]],standalone:!0,features:[l],decls:8,vars:0,consts:[[1,"relative","overflow-hidden"],[1,"h-[100vh]","pt-7","bg-fondo-login","grid","place-content-center"],[1,"container","flex","justify-center","items-center","gap-20"],[1,"hidden","md:block","md:end-0","flex-1","max-w-md","mx-auto","m-7","rounded-xl","dark:bg-neutral-900","dark:border-neutral-700","lg:max-w-lg"],[1,"md:flex-[0.6]","lg:flex-[0.6]","flex-1","max-w-md","mx-auto","m-7","bg-white","border","border-gray-200","rounded-xl","shadow-sm","dark:bg-neutral-900","dark:border-neutral-700","lg:max-w-lg"],[1,"mt-0"]],template:function(e,d){e&1&&(t(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3),a(4,"apartado-izquierdo"),r(),t(5,"div",4)(6,"div",5),a(7,"apartado-derecho"),r()()()()())},dependencies:[z,P],styles:['.bg-fondo-login[_ngcontent-%COMP%]{width:100%;background-image:url("./media/bg_fondo-CXGFOBCI.webp");object-fit:contain;background-position:center;background-size:cover}.rslt-text[_ngcontent-%COMP%]{background:linear-gradient(var(--color-principal-3) 0 100%) 0 / 100% calc(var(--line-height) / 1) no-repeat;-webkit-box-decoration-break:clone;line-height:var(--line-height);padding-bottom:20px}.text-decoration[_ngcontent-%COMP%]{position:relative;z-index:1}.text-decoration[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{position:absolute;right:-5px;bottom:8px;z-index:-1}']})}}return o})();export{H as LoginPageComponent};
