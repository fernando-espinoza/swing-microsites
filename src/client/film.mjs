export function initFilms(root=document){
 const videos=[...root.querySelectorAll('video')];
 for(const wrapper of root.querySelectorAll('[data-film]')){
  const video=wrapper.querySelector('video');const fallback=wrapper.querySelector('[data-film-fallback]');const status=wrapper.querySelector('[role="status"]');
  if(!video||!fallback||!status)continue;
  const failed=()=>{video.hidden=true;fallback.hidden=false;status.textContent='Film unavailable';};
  video.addEventListener('error',failed);if(video.error)failed();
  video.addEventListener('play',()=>{for(const other of videos)if(other!==video)other.pause();});
 }
 const pause=()=>{for(const video of videos)video.pause();};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
 window.addEventListener('pagehide',pause);
}
initFilms();
