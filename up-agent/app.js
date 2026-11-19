'use strict';
const nav=[...document.querySelectorAll('[data-section]')],sections=nav.map(a=>document.getElementById(a.dataset.section));
 let pending=false;
 function update(){let current=sections[0];sections.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.35)current=s});if(window.scrollY+innerHeight>=document.documentElement.scrollHeight-4)current=sections[sections.length-1];nav.forEach(a=>a.dataset.section===current.id?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));pending=false}
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);update();
