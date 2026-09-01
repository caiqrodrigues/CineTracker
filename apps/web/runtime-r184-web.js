/* r184 Web — restaura ações de adicionar favoritos removidas na reorganização r183 */
window.__ctR184='profile-favorite-add-gap-prompt';
window.__ct184ProfileFavorites='restore-series-movie-actor-add-controls';
window.__ct184WebBase='preserve-r183-clean-profile-layout';

function ct184RestoreFavoriteAdd(){
  const root=$('[data-profile]');if(!root)return;
  const cfg={
    'Séries Favoritas':{kind:'tv',label:'Série'},
    'Filmes Favoritos':{kind:'movie',label:'Filme'},
    'Atores Favoritos':{kind:'person',label:'Ator'}
  };
  root.querySelectorAll('section.panel').forEach(panel=>{
    const head=panel.querySelector(':scope>.panel-head');if(!head)return;
    const title=head.querySelector('h2,h3')?.textContent?.trim()||'',item=cfg[title];if(!item)return;
    if(head.querySelector(`[data-add-favorite="${item.kind}"]`))return;
    let actions=head.querySelector(':scope>.panel-actions');
    if(!actions){
      actions=document.createElement('div');actions.className='panel-actions ct184-favorite-actions';
      [...head.children].filter(el=>el.matches?.('small,.section-more,.ct-r180-profile-button')).forEach(el=>actions.appendChild(el));
      head.appendChild(actions);
    }else actions.classList.add('ct184-favorite-actions');
    const b=document.createElement('button');b.type='button';b.className='mini-add ct-r180-profile-button ct184-favorite-add';b.dataset.addFavorite=item.kind;b.textContent='＋ '+item.label;
    actions.appendChild(b);
  });
}

const ct184EnhanceProfileBase=ctR180EnhanceProfile;
ctR180EnhanceProfile=function(d=profileCache||{}){
  ct184EnhanceProfileBase(d);
  ct184RestoreFavoriteAdd();
  requestAnimationFrame(ct184RestoreFavoriteAdd);
};

setTimeout(()=>{if(route()==='profile')ct184RestoreFavoriteAdd()},0);
