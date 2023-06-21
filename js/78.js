!function(){"use strict";var t={d:function(e,r){for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},o:function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r:function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{END:function(){return _},MOVE:function(){return v},RESUME:function(){return b},START:function(){return w},UNDO:function(){return k}});var r={};t.r(r),t.d(r,{AGREE_DRAW:function(){return P},MOVE:function(){return E},OFFER_DRAW:function(){return A},REQUEST_TAKEBACK:function(){return x},RESIGN:function(){return $}});var n={};t.r(n),t.d(n,{ACTION:function(){return r},EVENT:function(){return e}});var o={};t.r(o),t.d(o,{anyCheckToPreviousPlayersKing:function(){return fr},calls:function(){return ur},hasLegalPly:function(){return cr},isInCheck:function(){return ar},nextLegalPlies:function(){return sr},nextPlies:function(){return ir},result:function(){return lr}});var i={};t.r(i),t.d(i,{filter:function(){return zr},scale:function(){return jr},softbans:function(){return Mr}});var s={};t.r(s),t.d(s,{naive:function(){return Rr},standard:function(){return Dr}});const c=11,a=12,u=13,l=15,f=1,h=2,d=3,p="base",m="violation",y="result",g="decisive",w="start",b="resume",v="move",k="undo",_="end",E="move",x="request-takeback",A="offer-draw",P="agree-draw",$="resign",C={[f]:f,[h]:h,r:f,w:f,b:h,red:f,white:f,black:h};function O(t){return function(t){if(void 0===t)throw new Error("Color is required.");if(t<1||t>2)throw new Error(`Invalid color code: ${t}.`);return t}(t)===f?"red":"black"}function N(t){return t===f?h:t===h?f:t===d?d:(()=>{throw new Error(`Invalid color code: ${t}`)})()}const S=8,j=7,z=[{offset:0,limit:2},{offset:2,limit:2},{offset:4,limit:2},{offset:6,limit:2},{offset:8,limit:2},{offset:10,limit:1},{},{offset:11,limit:5},{offset:16,limit:2},{offset:18,limit:2},{offset:20,limit:2},{offset:22,limit:2},{offset:24,limit:2},{offset:26,limit:1},{},{offset:27,limit:5}],M=Object.freeze({["A".charCodeAt()]:0,["a".charCodeAt()]:8,["E".charCodeAt()]:1,["e".charCodeAt()]:9,["H".charCodeAt()]:2,["h".charCodeAt()]:10,["R".charCodeAt()]:3,["r".charCodeAt()]:c,["C".charCodeAt()]:4,["c".charCodeAt()]:a,["K".charCodeAt()]:5,["k".charCodeAt()]:u,["P".charCodeAt()]:7,["p".charCodeAt()]:l,["B".charCodeAt()]:1,["b".charCodeAt()]:9,["N".charCodeAt()]:2,["n".charCodeAt()]:10});function T(t){return t<0?t:t&j}function I(t){const e=M[t];if(void 0===e)throw new Error(`Unrecognized code point: ${t}`);return e}Object.freeze([0,1,2,3,4,5,7,8,9,10,c,a,u,l]);const L=["advisor","elephant","horse","rook","cannon","king","","pawn"],K=["仕","相","傌","俥","炮","帥","","兵","士","象","馬","車","包","將","","卒"];function R(t){return`${O(function(t){return t<S?f:h}(t))} ${L[T(t)]}`}function q(t){return K[t]}const U=-1;function B(t){return t<0}function D(t){return t>=0}function H(t){return t>=0&&t<16}function V(t){return 1+(t>>4)}function W(t){return B(t)?U:16^t}function F(t){return(function(t){return 16|t}(t)>26?15|t:t)>>1}function G(t){return e=F(t),"AEHRCK-Paehrck-p".charAt(e);var e}function Q(t){return 10===t}function J(t){return Q(t)||function(t){return 26===t}(t)}function X(t){return t>>1==8}function Y(t){return t>>1==10}function Z(t){return t>>1==4}const tt=255,et=153,rt=16,nt=-16,ot=1,it=-1,st=rt+it,ct=rt+ot,at=nt+it,ut=nt+ot,lt=(rt<<1)+it,ft=(rt<<1)+ot,ht=(nt<<1)+it,dt=(nt<<1)+ot,pt=(it<<1)+rt,mt=(it<<1)+nt,yt=(ot<<1)+rt,gt=(ot<<1)+nt,wt=st<<1,bt=ct<<1,vt=at<<1,kt=ut<<1;function _t(t){return t>>4}function Et(t){return 15&t}function xt(t){return t===tt}function At(t){return t>=0&&(15&t)<9&&t>>4<10}Object.freeze({*[Symbol.iterator](){for(let t=0;t<10;t++)for(let e=t<<4,r=e+9;e<r;e++)yield e}});const Pt=et-1;function $t(t){return Pt-t}function*Ct(t,e){for(t+=e;At(t);)yield t,t+=e}function Ot(t){return(15&t)<8?t+1:t<Pt?16+(240&t):-1}const Nt=Object.freeze(new Set([3,4,5,19,20,21,35,36,37])),St=(Object.freeze({RED:Nt,BLACK:Object.freeze(new Set([...Nt].map($t)))}),Object.freeze(new Set([2,6,32,36,40,66,70]))),jt=Object.freeze({RED:St,BLACK:Object.freeze(new Set([...St].map($t)))}),zt=Object.freeze(new Set([3,5,35,37])),Mt=Object.freeze({RED:zt,BLACK:Object.freeze(new Set([...zt].map($t)))});function Tt(t){return t===tt?"--":String.fromCharCode(97+(15&t))+""+(t>>4)}const It=["一","二","三","四","五","六","七","八","九"],Lt=["１","２","３","４","５","６","７","８","９"],Kt="進",Rt="退",qt="平",Ut="前",Bt="中",Dt="後";function Ht(t,e){return(t===f?It:Lt)[8-e]}function Vt(t,e){return t.sort(((t,r)=>e(t)-e(r))),t}const Wt="undefined"!=typeof window,Ft="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope,Gt=Wt||Ft,Qt=Gt?self.btoa:t=>Buffer.from(t,"binary").toString("base64"),Jt=Gt?self.atob:t=>Buffer.from(t,"base64").toString("binary");function Xt(t){if("object"!=typeof t)return t;const e={};for(const r in t)Object.prototype.hasOwnProperty.call(t,r)&&void 0!==t[r]&&(e[r]=t[r]);return e}function Yt(t,e){for(const r in e)e.hasOwnProperty(r)&&Object.defineProperty(t,r,{value:e[r]})}function Zt(t,e){"function"==typeof t&&(t=t.prototype);for(const[r,n]of Object.entries(e))Object.hasOwnProperty.call(t,r)||Object.defineProperty(t,r,n)}class te extends Error{constructor(t,e){super(t),this.name="InvalidPlyError",this.data=e}}function ee(t,e,r,n=t.color){!function(t,e){if(!At(t))throw new te(`Origin square index is out of bound: ${t}`);if(!At(e))throw new te(`Destination square index is out of bound: ${e}`);if(t===e)throw new te(`Origin and destination cannot be the same: ${Tt(t)}`)}(e,r),function(t,e,r,n){const{board:o}=t;if(V(o.at(e))!==n)throw new te(`No ${O(n)} piece at ${Tt(e)}`);if(V(o.at(r))===n)throw new te(`A ${O(n)} piece occupies destination square: ${Tt(r)}`)}(t,e,r,n),function(t,e,r,n){let{board:o}=t,i=o.at(e);n===h&&(o=o.mirror,i=W(i),e=$t(e),r=$t(r)),re[F(i)](e,r,o)}(t,e,r,n)}const re=[function(t,e){if(!(20===t&&ne(e)||20===e&&ne(t)))throw new te("Illegal movement for advisor.")},function(t,e,r){const n=Math.abs(t-e);if(34!==n&&30!==n)throw new te("Illegal movement for elephant.");oe(r,t+e>>1,"Elephant")},function(t,e,r){let n;switch(e-t){case 33:case 31:n=16;break;case-33:case-31:n=-16;break;case 18:case-14:n=1;break;case-18:case 14:n=-1;break;default:throw new te("Illegal movement for horse.")}oe(r,t+n,"Horse")},function(t,e,r){const n=ie(t,e,"rook");for(let o=t+n;o!==e;o+=n)oe(r,o,"Rook")},function(t,e,r){const n=ie(t,e,"cannon"),o=B(r.at(e))?0:1;let i=0;for(let s=t+n;s!==e&&(B(r.at(s))||(i++,!(i>o)));s+=n);if(i!==o)throw new te("Illegal movement for cannon.")},function(t,e){const r=15&e;if(r<3||r>5||e>>4>2)throw new te("Illegal destination for king.");const n=Math.abs(e-t);if(1!==n&&16!==n)throw new te("Illegal movement for king.")},void 0,function(t,e){const r=e-t;if(!(16===r||(1===r||-1===r)&&t>>4>4))throw new te("Illegal movement for pawn.")}];function ne(t){const e=t>>4,r=15&t;return!(0!==e&&2!==e||3!==r&&5!==r)}function oe(t,e,r){if(!B(t.at(e)))throw new te(`${r} movement is blocked.`)}function ie(t,e,r){const n=t>>4,o=15&t,i=e>>4,s=15&e;if(n!==i&&o!==s)throw new te(`Illegal movement for ${r}.`);return n===i?o<s?1:-1:n<i?16:-16}class se{constructor(t,e){this.sid=t,this.pid=e,Object.freeze(this)}get mirror(){return new se($t(this.sid),W(this.pid))}toString(){return`${G(this.pid)}/${Tt(this.sid)}`}}const ce=[ge,ge,be,be,ve,ve,_e,_e,xe,xe,function*(t){const e=t>>4;e>0&&(yield t+nt),e<2&&(yield t+rt);const r=15&t;r>3&&(yield t+it),r<5&&(yield t+ot)},Pe,Pe,Pe,Pe,Pe];function*ae({board:t},e){B(e)||(yield*(H(e)?le:ue)(t,e))}function*ue(t,e){for(const r of le(t.mirror,W(e)))yield r.mirror}function*le(t,e){const r=t.pieces.get(e);for(const n of ce[e](r,t)){const e=t.at(n);H(e)&&!Q(e)&&(yield new se(n,e))}}function*fe({board:t,color:e}){yield*(e===f?de:ye)(t)}function*he({board:t},e){if(B(e))return;const r=t.pieces.get(e);yield*(H(e)?me:pe)(t,e,r)}function*de(t){for(const{pid:e,sid:r}of t.pieces.RED)yield*me(t,e,r)}function*pe(t,e,r){for(const n of me(t.mirror,W(e),$t(r)))yield n.mirror}function*me(t,e,r){for(const n of ce[e](r,t)){const o=t.at(n);H(o)||(yield new De(r,n,e,o))}}function*ye(t){for(const e of de(t.mirror))yield e.mirror}function*ge(t){20===t?(yield 3,yield 5,yield 35,yield 37):yield 20}const we=[32,2,66,36,6,70,40].reduce(((t,e)=>{const r=e>>4,n=15&e,o=[];function i(t){const r=e+t;o.push([r,r+t])}return n>0&&(r>0&&i(at),r<4&&i(st)),n<8&&(r>0&&i(ut),r<4&&i(ct)),t.set(e,o),t}),new Map);function*be(t,e){for(const[r,n]of we.get(t))$e(e,r)&&(yield n)}function*ve(t,e){const r=t>>4,n=15&t;n>1&&$e(e,t+it)&&(r>0&&(yield t+mt),r<9&&(yield t+pt)),n<7&&$e(e,t+ot)&&(r>0&&(yield t+gt),r<9&&(yield t+yt)),r>1&&$e(e,t+nt)&&(n>0&&(yield t+ht),n<8&&(yield t+dt)),r<8&&$e(e,t+rt)&&(n>0&&(yield t+lt),n<8&&(yield t+ft))}const ke=[rt,nt,it,ot];function*_e(t,e){for(const r of ke)yield*Ee(t,e,r)}function*Ee(t,e,r){for(const n of Ct(t,r))if(yield n,!$e(e,n))return}function*xe(t,e){for(const r of ke)yield*Ae(t,e,r)}function*Ae(t,e,r){let n=!1;for(const o of Ct(t,r)){const t=$e(e,o);if(n){if(!t)return void(yield o)}else t?yield o:n=!0}}function*Pe(t){const e=t>>4;if(e<5)yield t+rt;else{e<9&&(yield t+rt);const r=15&t;r>0&&(yield t+it),r<8&&(yield t+ot)}}function $e(t,e){return B(t.at(e))}function Ce(){return Math.random()*2**32|0}function Oe(t){return t[Math.floor(Math.random()*t.length)]}function Ne(t){for(const e of t)return e}function Se(t){return Ne(function*(t){var e;yield*Te(t,(e=t.color,1===e?10:26))}(t))}function*je(t,e){for(const r of he(t,e))D(r.captured)&&(yield r)}function ze(t,e,r){const{pieces:n}=t.board;return function(t,e,r,n){try{return ee(t,e,r,n),!0}catch(t){return!1}}(t,n.get(r),n.get(e),V(r))}function Me(t,e){return Ne(Te(t,e))}function*Te(t,e){const r=N(V(e)),n=t.board.pieces.get(e),o=J(e);yield*function*({board:t},{color:e,sid:r,toKing:n=!1}={}){const o=e===f?Ie:Le;for(const e of o(t,r,n))yield t.ply(e,r)}(t,{color:r,sid:n,toKing:o})}function*Ie(t,e,r){for(const n of Le(t.mirror,$t(e),r))yield $t(n)}function*Le(t,e,r){for(const n of[rt,it,ot,nt])yield*Ke(t,e,n,r);yield*function*(t,e){for(const[r,...n]of Re)if(B(t.at(e+r)))for(const r of n){const n=e+r;At(n)&&(Y(t.at(n))&&(yield n))}}(t,e),r||(yield*function*(t,e){if(jt.BLACK.has(e))for(const[r,n]of qe){if(!B(t.at(e+r)))continue;const o=e+n;At(o)&&(t.at(o)>>1==9&&(yield o))}}(t,e)),r||(yield*function*(t,e){if(132===e){let e=0;for(const r of Mt.BLACK)if(X(t.at(r))&&(yield r,2==++e))break}Mt.BLACK.has(e)&&X(t.at(132))&&(yield 132)}(t,e))}function*Ke(t,e,r,n=!1){let o=!1,i=!0;for(const s of Ct(e,r)){const e=t.at(s);if(B(e)){i=!1;continue}const f=F(e);if(o)return void(f===a&&(yield s));switch(f){case c:yield s;break;case u:(n||i)&&(yield s);break;case l:i&&r!==nt&&(r===rt||s>>4<5)&&(yield s)}i=!1,o=!0}}const Re=[[st,lt,pt],[ct,ft,yt],[at,ht,mt],[ut,dt,gt]],qe=[[st,wt],[ct,bt],[at,vt],[ut,kt]],Ue=new Map;function Be(t,e){return function(t){if(Ue.has(t))return Ue.get(t);const e=Ce();return Ue.set(t,e),e}((e<<4)+F(t))}class De{#t;static decode(t){let e=t>>22&63;return e=63===e?-1:e,new De(t>>6&255,t>>14&255,63&t,e)}constructor(t,e,r,n){const o=function(t,e,r,n){return r|t<<6|e<<14|(n<0?63:n)<<22}(t,e,r,n);Yt(this,{from:t,to:e,pid:r,captured:n,code:o})}get color(){return V(this.pid)}get mirror(){return new De($t(this.from),$t(this.to),W(this.pid),W(this.captured))}get hash(){return void 0===this.#t&&(this.#t=function({pid:t,from:e,captured:r,to:n}){const o=Be(t,e)^Be(t,n);return D(r)?o^Be(r,n):o}(this)),this.#t}get snapshot(){const{from:t,to:e,pid:r,captured:n,color:o}=this;return{from:t,to:e,pid:r,captured:n,color:o}}toString(){return`${G(this.pid)}/${Tt(this.from)}${Tt(this.to)}`+(D(this.captured)?`/${G(this.captured)}`:"")}}function He(t){return Int8Array.from(t)}function Ve(){const t=new Int8Array(et);return t.fill(U),t}function We(t,e,r){t.fill(r,e,e+1)}class Fe{static fromBoard(t){const e=new Uint8Array(32);e.fill(tt);for(let r=0;r>=0;r=Ot(r)){const n=t.at(r);B(n)||We(e,n,r)}return new Fe(e)}static load(t){return new Fe(new Uint8Array(function(t){const e=Jt(t),r=e.length,n=new Uint8Array(r);for(let t=0;t<r;t++)n.fill(e.charCodeAt(t),t,t+1);return n.buffer}(t)))}#e;#r;constructor(t){this.#e=t}get(t){return this.#e.at(t)}*slice(t,e){for(let r=t;r<e;r++){const t=this.#e.at(r);t!==tt&&(yield new se(t,r))}}get snapshot(){return this.#r||(this.#r=function(t){let e="";for(const r of new Uint8Array(t))e+=String.fromCharCode(r);return Qt(e)}(this.#e.buffer))}transit(t){const e=new Uint8Array(this.#e),{to:r,pid:n,captured:o}=t;return We(e,n,r),D(o)&&We(e,o,tt),new Fe(e)}undo(t){const e=new Uint8Array(this.#e),{from:r,to:n,pid:o,captured:i}=t;return We(e,o,r),D(i)&&We(e,i,n),new Fe(e)}}class Ge{constructor(t){this._mirror=t}get(t){return $t(this._mirror.get(W(t)))}*slice(t,e){if(!(t>=e))if(0===t&&32===e||t>=16||e<16)for(const t of this._mirror.slice(0,32))yield t.mirror;else if(t>=16||e<16)for(const r of this._mirror.slice(W(t),W(e)))yield r.mirror;else{for(const t of this._mirror.slice(0,W(e)))yield t.mirror;for(const e of this._mirror.slice(W(t),32))yield e.mirror}}transit(t){return this._mirror.transit(t.mirror).mirror}get snapshot(){throw new Error("Not implemented")}}class Qe{#n;#o;constructor(t,e){this.#n=t,this.#o=e}get(t){const{to:e,pid:r,captured:n}=this.#o;return t===r?e:t===n?tt:this.#n.get(t)}*slice(t,e){const{to:r,pid:n,captured:o}=this.#o;for(const i of this.#n.slice(t,e))i.pid===n?yield new se(r,n):i.pid!==o&&(yield i)}get snapshot(){throw new Error("Not implemented")}}const Je={mirror:{get(){return this._mirror||(this._mirror=new Ge(this))}},preview:{value(t){return new Qe(this,t)}}};for(const t of[Fe,Ge,Qe])Zt(t,Je);class Xe{static fromBoard(t){return new Xe(Fe.fromBoard(t))}static load(t){return new Xe(Fe.load(t))}#i;#s;constructor(t){this.#i=t}*[Symbol.iterator](){yield*this.#i.slice(0,32)}get(t){return this.#i.get(t)}get RED(){return this.#i.slice(0,16)}get BLACK(){return this.#i.slice(16,32)}get RED_PAWNS(){return this.#i.slice(11,16)}get BLACK_PAWNS(){return this.#i.slice(27,32)}ofColor(t){return t===f?this.RED:this.BLACK}get mirror(){return this.#s||(this.#s=new Xe(this.#i.mirror))}get snapshot(){return this.#i.snapshot}preview(t){return new Xe(this.#i.preview(t))}transit(t){return new Xe(this.#i.transit(t))}undo(t){return new Xe(this.#i.undo(t))}}class Ye{static parse(t){return new Ye(function(t){const e=Ve();function r(e){throw new Error(`Unrecognized character "${t.charAt(e)}" in FEN at index ${e}.`)}function n(t){throw new Error(`Invalid FEN: incorrect number of cells in rank ${t+1}.`)}function o(){throw new Error("Invalid FEN: incorrect number of ranks.")}const i=function(){const t=Array(16).fill(0);return Object.freeze({get(e){const{offset:r,limit:n}=z[e],o=t[e]++;if(o>=n)throw new Error(`Exceed piece limit (${n}) for ${R(e)}`);return r+o}})}();let s=9,c=0;for(let a=0,u=s<<4,l=t.length;a<l;a++){const l=t.charCodeAt(a);if(l>64){(l>122||l>90&&l<97)&&r(a),c++,c>9&&n(s);const t=u+1;e.fill(i.get(I(l)),u,t),u=t}else if(l>48&&l<58){l>57&&r(a);const t=15&l;c+=t,c>9&&n(s),u+=t}else 47===l&&(9!==c&&n(s),s--,c=0,u=s<<4,s<0&&o())}return 0!==s&&o(),9!==c&&n(s),e}(t))}static load(t){const e=Xe.load(t),r=function(t){const e=Ve();for(const{sid:r,pid:n}of t)e.fill(n,r,r+1);return e}(e);return new Ye(r,{pieces:e})}#e;_pieces;_hash;_mirror;_notation;constructor(t,{hash:e,pieces:r}={}){this.#e=t,this._pieces=r,this._hash=e}at(t){return this.#e.at(t)}get pieces(){return this._pieces||(this._pieces=Xe.fromBoard(this))}_computeHash(){return function(t){let e=0;for(const{pid:r,sid:n}of t.pieces)e^=Be(r,n);return e}(this)}_computeNotation(){return function(t){const e=[];for(let r=9;r>=0;r--){let n="",o=0,i=r<<4;function s(){o&&(n+=`${o}`,o=0)}for(let c=0;c<9;c++){const a=t.at(i);B(a)?o++:(s(),n+=G(a)),i++}s(),e.push(n)}return e.join("/")}(this.#e)}transit(t){t.pid||(t=this.ply(t.from,t.to));const{from:e,to:r}=t,n=He(this.#e);return n.fill(this.#e.at(e),r,r+1),n.fill(-1,e,e+1),new Ye(n,{hash:this.hash^t.hash,pieces:this.pieces.transit(t)})}undo(t){const{from:e,to:r,pid:n,captured:o}=t,i=He(this.#e);return i.fill(n,e,e+1),i.fill(o,r,r+1),new Ye(i,{hash:this.hash^t.hash,pieces:this.pieces.undo(t)})}}class Ze{static#t;static get hash(){return Ze.#t||(Ze.#t=Ce())}_hash;_mirror;_notation;constructor(t){this._mirror=t,Yt(this,{mirrored:!0})}at(t){return W(this._mirror.at($t(t)))}get pieces(){return this._mirror.pieces.mirror}_computeHash(){return this._mirror.hash^Ze.hash}get notation(){return this._notation||(this._notation=this._computeNotation())}_computeNotation(){const t=this._mirror.notation,e=t.length,r=Array(e);for(let n=0;n<e;n++){const o=t.charCodeAt(e-1-n);r[n]=o>64?32^o:o}return String.fromCharCode(...r)}}class tr{#n;#o;#c;_pieces;_hash;_mirror;constructor(t,e){void 0===e.pid&&(e=t.ply(e.from,e.to)),this.#n=t,this.#o=e,Yt(this,{previewing:!0})}at(t){const{from:e,to:r,pid:n}=this.#o;return t===e?-1:t===r?n:this.#n.at(t)}get pieces(){return this._pieces||(this._pieces=this.#n.pieces.preview(this.#o))}_computeHash(){return this.#n.hash^this.#o.hash}get notation(){return this.commit().notation}commit(){return this.#c||(this.#c=this.#n.transit(this.#o))}}const er={hash:{get(){return void 0!==this._hash?this._hash:this._hash=this._computeHash()}},notation:{get(){return this._notation||(this._notation=this._computeNotation())}},snapshot:{get(){return this.pieces.snapshot}},ply:{value(t,e){return new De(t,e,this.at(t),this.at(e))}},mirror:{get(){return this._mirror||(this._mirror=new Ze(this))}},preview:{value(t){return new tr(this,t)}}};for(const t of[Ye,Ze,tr])Zt(t,er);class rr{static#a;static standard(){return rr.#a||(rr.#a=rr.parse("rheakaehr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RHEAKAEHR r - - 0 1"))}static parse(t){const[e,r="r",n,o,i="0",s="1"]=t.split(/\s+/g);return new rr({board:Ye.parse(e),color:(c=r,C[c&&c.toLowerCase()]||(()=>{throw new Error(`Unrecognized color notation: ${c}.`)})()),clock:Number(i),moveNum:Number(s)});var c}static load({board:t,color:e,clock:r,moveNum:n}){return new rr({board:Ye.load(t),color:e,clock:r,moveNum:n})}_hash;_fen;_snpashot;constructor({board:t,color:e,clock:r=0,moveNum:n=1}){Yt(this,{board:t,color:e,clock:r,moveNum:n})}transit(t){t.piece||(t=this.ply(t.from,t.to));const e=N(this.color);return new rr({board:this.board.transit(t),color:e,clock:D(t.captured)?0:this.clock+1,moveNum:this.color===h?this.moveNum+1:this.moveNum})}undo(t,{clock:e=0}={}){const r=N(this.color);return new rr({board:this.board.undo(t),color:r,clock:D(t.captured)?e:this.clock-1,moveNum:r===h?this.moveNum-1:this.moveNum})}}class nr{#n;#o;#u;#c;constructor(t,e){this.#n=t,this.#o=e,Yt(this,{previewing:!0})}get board(){return this.#u||(this.#u=this.#n.board.preview(this.#o))}get color(){return N(this.#n.color)}get clock(){return B(this.#o.captured)?0:this.#n.clock+1}get moveNum(){return this.#n.color===h?this.#n.moveNum+1:this.#n.moveNum}commit(){return this.#c||(this.#c=this.#n.transit(this.#o))}}const or={ply:{value(t,e){return this.board.ply(t,e)}},preview:{value(t){return new nr(this,t)}},hash:{get(){return this._hash||(this._hash=function({board:t,color:e}){const r=t.hash^function(t){return t-1}(e);return r&r}(this))}},fen:{get(){return this._fen||(this._fen=`${this.board.notation} ${function(t){switch(t){case f:return"r";case h:return"b"}throw new Error(`Unrecognized color code: ${t}.`)}(this.color)} - - ${this.clock} ${this.moveNum}`)}},snapshot:{get(){return this._snpashot||(this._snpashot=Object.freeze({board:this.board.snapshot,color:this.color,clock:this.clock,moveNum:this.moveNum}))}}};for(const t of[rr,nr])Zt(t,or);function ir(t,e){return[...fe(e)].map((r=>{const n=e.preview(r);try{r.calls=[...t.apply("preTransit",{position:e,ply:r,preview:n})]}catch(t){r.calls=[hr(t)]}for(const t of r.calls)if(t.type===m){r.violation=t;break}return r}))}function sr(t,e){return ir(t,e).filter((t=>!t.violation))}function cr(t,e){t:for(const r of fe(e)){const n=e.preview(r);try{for(const o of t.apply("preTransit",{position:e,ply:r,preview:n}));}catch(t){if(t instanceof te)continue t;throw t}return!0}return!1}function ar(t,e){return!!Se(e)}function ur(t,e){return[...t.apply("onPosition",{position:e})]}function lr(t,e){return function(t){for(const e of t)if(e.type===y){const{[y]:t,...r}=e;return{...r,type:t}}}(ur(t,e))}function fr(t,e){const{board:r,color:n,hash:o}=e;return Se({board:r,color:N(n),hash:o})}function hr(t){if(t instanceof te)return{type:m,reason:t.message};throw t}const dr=Object.keys(o);class pr{#l;#f;#h;constructor(t,e){this.#f=t,this.#l=e,this.#h=dr.reduce(((t,e)=>(t[e]=void 0,t)),{})}get nextPlies(){return this.#h.nextPlies||(this.#h.nextPlies=ir(this.#f,this.#l))}get nextLegalPlies(){return this.#h.nextLegalPlies||(this.#h.nextLegalPlies=sr(this.#f,this.#l))}get hasLegalPly(){return this.#h.hasLegalPly||(this.#h.hasLegalPly=cr(this.#f,this.#l))}get isInCheck(){return this.#h.isInCheck||(this.#h.isInCheck=ar(this.#f,this.#l))}get calls(){return this.#h.calls||(this.#h.calls=ur(this.#f,this.#l))}get result(){return this.#h.result||(this.#h.result=lr(this.#f,this.#l))}get anyCheckToPreviousPlayersKing(){return this.#h.anyCheckToPreviousPlayersKing||(this.#h.anyCheckToPreviousPlayersKing=fr(this.#f,this.#l))}}const mr=[class{static get name(){return p}#d;initialize(t){this.#d=t}*preMove({position:t,from:e,to:r}){ee(t,e,r)}*preTransit({preview:t}){const e=this.#d.queries(t).anyCheckToPreviousPlayersKing;if(e)throw new te(`King in check by ${R(F(e.pid))} after the move.`,{check:e})}*onPosition({position:t}){const e=this.#d.queries(t);if(!e.hasLegalPly){const{isInCheck:r}=e;yield{type:y,result:g,winner:N(t.color),reason:r?"checkmate":"stalemate"}}}}],yr=mr.reduce(((t,e)=>(t[e.name]=e,t)),{});function gr(t){return"string"==typeof t&&(t=yr[t]),"function"==typeof t&&(t=new t),t}class wr{#f;constructor(t){this.#f=t.map(gr)}*[Symbol.iterator](){for(const t of this.#f)yield t}*apply(t,e){for(const r of this.#f)r[t]&&(yield*r[t](e))}}class br{#f;constructor({rules:t=[p]}={}){this.#f=new wr(t);for(const t of this.#f)t.initialize(this)}get rules(){return this.#f}queries(t){return new pr(this.#f,t)}transit(t,e,r){const{rules:n}=this;let o=[...n.apply("preMove",{position:t,from:e,to:r})];const i=t.ply(e,r),s=function(t,e){const r=function(t,e){const r=F(e.pid),n=V(e.pid);let o=t.board;n===h&&(o=o.mirror,e=e.mirror);const{from:i,to:s}=e,c=Et(i);let a=0,u=0,l=!1;switch(T(r)){case 5:case 0:case 1:a=1;break;case 2:case 3:case 4:const t=1^e.pid,n=o.pieces.get(t);xt(n)||Et(n)!==c?a=1:(a=2,_t(i)<_t(n)&&u++);break;case 7:const s=_t(i);let f=0;for(const{sid:t}of o.pieces.RED_PAWNS){if(xt(t))continue;const e=Et(t),r=1<<e;e===c?(_t(t)>s&&u++,a++):f&r&&(l=!0),f|=r}break;default:throw new Error(`Unknown piece: ${r}`)}return{color:n,piece:r,from:i,to:s,file:c,stack:a,ordinal:u,disambiguation:l}}(t,e);return`${function(t){const{stack:e,color:r,piece:n,file:o}=t;return 1===e?`${q(n)}${Ht(r,o)}`:`${function({ordinal:t,stack:e}){if(0===t)return Ut;switch(e){case 1:throw new Error("Unexpected stack size: 1");case 2:return Dt;case 3:return 1===t?Bt:Dt;default:return It[t]}}(t)}${function({color:t,piece:e,file:r,disambiguation:n}){return n?Ht(t,r):q(e)}(t)}`}(r)}${function({color:t,from:e,to:r}){const n=Et(e),o=_t(e),i=Et(r),s=_t(r);return`${s===o?qt:s>o?Kt:Rt}${n===i?function(t,e){return(t===f?It:Lt)[e-1]}(t,Math.abs(s-o)):Ht(t,i)}`}(r)}`}(t,i),c=t.preview(i);return o=[...o,...n.apply("preTransit",{position:t,ply:i,preview:c})],t=t.transit(i),o=[...o,...n.apply("postTransit",{position:t,ply:i})],[t,i,o,s]}}const{ACTION:vr}=n,kr={move(t,{from:e,to:r}){this.send(vr.MOVE,{index:t,from:e,to:r})},requestTakeback(t){this.send(vr.REQUEST_TAKEBACK,{index:t})}};Object.assign(class{#p;constructor(t,e){this.#p=e,this.color=t,Object.freeze(this)}subscribe(t){return this.#p.subscribe(t)}send(t,e){this.#p.send(t,e)}}.prototype,kr);const{ACTION:_r,EVENT:Er}=n;class xr{static load({initialPosition:t,position:e,plies:r,result:n}){return t=t?rr.load(t):rr.standard(),e=e?rr.load(e):t,r=r.map(De.decode),new xr({initialPosition:t,position:e,plies:r,result:n})}constructor({initialPosition:t,position:e,result:r,plies:n}){Object.assign(this,{initialPosition:t,position:e,plies:n,result:r}),Object.freeze(this)}get index(){return this.plies.length}transit(t,e){const{initialPosition:r,position:n,plies:o}=this,{from:i,to:s}=t;return new xr({initialPosition:r,position:n.transit(n.ply(i,s)),plies:[...o,t],result:e})}undo(t){let{initialPosition:e,position:r}=this;for(const e of this.plies.slice(-t).reverse())r=r.undo(e);return new xr({initialPosition:e,position:r,plies:this.plies.slice(0,-t),result:void 0})}}const{EVENT:Ar}=n;class Pr{#p;#m;#y;#g;#w;#b;#v;constructor(t,{delay:e=500,handle:r,...n}={}){this.#y=t,this.#g=e,this.#w=n,this.handle=r}set handle(t){this.#p!==t&&(this.#p&&(this.#m(),this.#p=void 0),t&&(this.#p=t,this.#m=t.subscribe(((...t)=>this.#k(...t)))))}get color(){return this.#p.color}get profile(){return{color:this.#p.color}}get options(){return this.#w}#k(t,e){switch(t){case Ar.START:case Ar.RESUME:this.#_(e);break;case Ar.MOVE:this.#E(e);break;case Ar.UNDO:this.#x(e)}}#_({index:t,game:e}){this.#b=xr.load(e),this.#v=t,this.#A()}#E({index:t,ply:e,result:r}){e=De.decode(e),this.#b=this.#b.transit(e,r),this.#v=t+1,this.#A()}#x({index:t,count:e}){this.#b=this.#b.undo(e),this.#v=t-e,this.#A()}#A(){const t=this.#v,e=this.#b;if(e.position.color!==this.color||e.result)return;const r=Date.now()+this.#g;setTimeout((()=>this.#P(t,e,r)))}async#P(t,e,r){const n=performance.now(),o=await this.#y.next(e),i=performance.now()-n;console.log(`[BOT] ${O(this.#p.color)}: ${o} (${i.toFixed(2)}ms)`);const s=r-Date.now();s>0?setTimeout((()=>this.#p.move(t,o)),s):this.#p.move(t,o)}}class $r{#d;constructor({rules:t}={}){this.#d=new br({rules:t})}async next(t){const e=this.#d.queries(t.position).nextLegalPlies;return Oe(Oe(Object.values(e.reduce(((t,e)=>{const r=`${e.pid}`;return(t[r]=t[r]||[]).push(e),t}),{}))))}}class Cr{#$;constructor(t){Object.assign(this,t),Object.freeze(this)}get me(){return this.before.color}get opponent(){return N(this.me)}get after(){return this.#$||(this.#$=this.before.preview(this.ply))}}class Or{#d;#C;#O;constructor({config:t,heuristic:e}={}){const{rules:r}=t;this.#d=new br({rules:r}),this.#C=t||{},this.#O=e||(()=>0)}async next({position:t,plies:e}){const r=this.#d,n=function(t){for(let e=t.length;e>1;){const r=Math.floor(Math.random()*e);e--,e!==r&&([t[e],t[r]]=[t[r],t[e]])}return t}(r.queries(t).nextLegalPlies),o=e.slice(-2);o.reverse();let i,s={context:r,lastPlies:o,before:t};s.t=function(t){const e=new Map;return{memoize(r,n){if(e.has(r))return e.get(r);const o=n(t);return e.set(r,o),o}}}(s);let c=!1;const a=[];for(const t of n){const e=this.#N(new Cr({...s,ply:t}));if(e===1/0){const{preferences:e}=this.#C;if(i)continue;if(i=t,Math.random()<(e.win||1)){c=!0;break}}a.push({score:e,ply:t})}if(i&&(c||0===a.length))return this.#S(s,1/0,{ply:i,score:1/0}),i;Vt(a,(t=>-t.score));const u=this.#j(a);return this.#S(s,i?1/0:a[0].score,u),u.ply}#N(t){return Math.round(this.#O.evaluate(t))}#j(t){for(const e of t){const{score:t}=e;if(Math.random()>.5**Math.max(1,t/100))return e}return t[t.length-1]}#S(t,e,r){const{ply:n}=r;console.log(t.before.fen,t.lastPlies.map((t=>t.code))),console.log(`${n}: ${Nr(r.score)} ${r.score===e?"(best)":`(best = ${Nr(e)})`} = ${this.#O.explain(new Cr({...t,ply:n}))}`)}}function Nr(t){return t===1/0?"win":`${t}`}class Sr{constructor(t,e={}){Object.assign(this,e),this._fn=t,Object.freeze(this)}evaluate(t){return this._fn(t)}explain(t){const{name:e}=this;return`${e?`${e}:`:""}${this.evaluate(t)}`}}function jr(t,e){return[r=>t.evaluate(r)*e,{explain:r=>`(${t.explain(r)})*${e}`}]}function zr(t,e){return r=>e.test(r)?t.evaluate(r):0}function Mr(t,e){return Vt(e,(t=>t.maxScore||0)),[r=>{const n=t.evaluate(r);for(const{predicate:t,maxScore:o}of e)if(t.test(r))return Math.min(o,n);return n},{explain:r=>{const n=t.evaluate(r);for(const{predicate:t,maxScore:o}of e)if(t.test(r)&&n>o)return`softbanned to ${o}`;return t.explain(r)}}]}function Tr(){return Ir}const Ir=new Sr((()=>0),{name:"zero",zero:!0,filter(){return this},scale(){return this}});function Lr(t,e,r={}){return new Sr(e,{name:t,...r})}const Kr=400;function Rr(){return Kr}const qr=100,Ur=200,Br=[200,200,400,900,450,999999];function Dr(t,e){const r=function(t){return 15&t}(e);if(!function(t){return t>=11&&t<=15}(r))return Br[r>>1];const n=t.board.pieces.get(e)>>4;return H(e)===n>4?Ur:qr}const Hr="naive.";function Vr(t){return Hr+t}const Wr="standard",Fr=50,Gr=Symbol("capture.obvious-ply"),Qr=Symbol("capture.recapturing-ply"),Jr=Symbol("protect.scaled-value-fn");function Xr(t=0){return Math.min(Math.max(.5+t/4,0),1)}function Yr({lastPlies:t}){const e=t.length;return 0===e?()=>!1:1===e?({captured:e})=>e===t[0].pid:({captured:e,pid:r})=>e===t[0].pid||r===t[1].pid}function Zr({lastPlies:t}){return 0===t.length?()=>!1:({captured:e})=>e===t[0].pid}function tn(t,e,r,n){const o=[];for(const{pid:e}of ae(t,r))o.push({pid:e,score:n(t,e)});for(const{pid:t,score:r}of Vt(o,(t=>-t.score)))if(nn(e,t))return r;return 0}function en(t,e){if(nn(t,e))return!1;for(const{captured:r}of je(t,e))if(!J(r)&&nn(t,r))return!0;return!1}function rn(t,e,r){if(J(r))return 0;let n=1/0;for(const o of Te(e,r)){const i=e.preview(o);if(!Me(i,o.pid))return t(e,r);n=Math.min(n,t(i,o.pid))}return n===1/0?0:Math.max(t(e,r)-n,0)}function nn(t,e){if(J(e))return!1;for(const r of Te(t,e))if(!Me(t.preview(r),r.pid))return!0;return!1}const on=Lr("win",(({context:t,after:e,me:r})=>{const n=t.queries(e).result;return n&&n.type===g&&n.winner===r?1/0:0}));class sn{constructor(t){this._fn=t}test(t){return this._fn(t)}get negate(){return new sn((t=>!this.test(t)))}}function cn(t){return new sn(t)}cn((()=>!0)),cn((()=>!1));const an=cn((({before:t,ply:e})=>{const r=t.color===h;r&&(e=e.mirror);const{pid:n,captured:o,from:i,to:s}=e;if(!Z(n)||!Y(o))return!1;const c=33===i;return!(!c&&39!==i||s!==(c?145:151))&&function(t){return t>>1==11}((r?t.board.mirror:t.board).at(c?144:152))}));const un=cn((({before:t,ply:e})=>{if(t.moveNum>3)return!1;const r=t.color===h;r&&(e=e.mirror);const{pid:n,to:o}=e;return!!Z(n)&&(97===o||103===o||(34===o||36===o||38===o)&&function(t){return t>=27&&t<=31}((r?t.board.mirror:t.board).at(o+64)))}));!function(t){for(const[e,r]of Object.entries(i))t.prototype[e]=function(...e){return new t(...(n=r(this,...e),Array.isArray(n)?n:void 0===n?[]:[n]));var n}}(Sr);var ln=[{preset:"butterfly",abilities:{}},{preset:"bunny",abilities:{dodge:1},quirks:{valuing:"naive"}},{preset:"crab",abilities:{capture:1},quirks:{sidewalking:!0,valuing:"naive"}},{preset:"duckling",abilities:{capture:1,dodge:1},quirks:{valuing:"naive"}},{preset:"chihuahua",abilities:{capture:1,check:1,chase:1},quirks:{check:2,chase:2}},{preset:"baby-tortoise",abilities:{capture:1,dodge:1,protect:1},quirks:{capture:.5,dodge:2,protect:2,conscious:1,vengeful:1}},{preset:"kitten",abilities:{capture:1,dodge:1,protect:1,check:1,chase:1,win:1},quirks:{conscious:-2}}];const fn=ln.reduce(((t,e)=>(t[e.preset]=e,t)),{});function hn(t){return"random"===t&&(t=Oe(Object.values(ln))),"string"==typeof t&&(t={preset:t}),function(t={},{abilities:e,preferences:r,knowledge:n,quirks:o,...i}={}){return e={...t.abilities,...e},r={...t.preferences,...r},n={...t.knowledge,...n},o={...t.quirks,...o},{...t,abilities:e,preferences:r,knowledge:n,quirks:o,...i}}(fn[t.preset],t)}function dn(t){const{abilities:{win:e,...r}={},rules:n}=t=hn(t);let o=Object.keys(r);if(e>0&&(o=["win",...o]),0===o.length)return new Pr(new $r);const i=function({quirks:t={}}={}){const{capture:e,dodge:r,protect:n,check:o,chase:i,win:s}=t;return Xt({capture:e,dodge:r,protect:n,check:o,chase:i,win:s})}(t),c=function({quirks:t={}}={}){const{valuing:e,conscious:r=0}=t;return Xt({valuing:e,conscious:r})}(t);let a=function(...t){t=t.filter((t=>!t.zero));const e=t.length;return 0===e?Tr():1===e?t[0]:function(t,e){return new Sr(t,e)}((e=>{let r=0;for(const n of t){const t=n.evaluate(e);if(t===1/0)return t;r+=t}return r}),{explain:e=>t.map((t=>t.explain(e))).join(" + ")})}(...o.map((t=>function(t,e,r){return function(t,e=1){return 1===e?t:0===e?Tr():t.scale(e)}(function(t,e){switch(t){case"capture":return function({valuing:t=Wr,conscious:e,vengeful:r}={}){const n=Xr(e),o=function(t=0){return Math.max(.5+t/4,0)}(r),i=s[t];return Lr(Vr("capture"),(({before:t,ply:e,t:r})=>{const{captured:s}=e;if(!D(s))return 0;const c=1===n||r.memoize(Gr,Yr),a=1!==o&&r.memoize(Qr,Zr);let u=i(t,s);return c(e)||(u*=n),a&&(u*=o),u}))}(e);case"dodge":return function({valuing:t=Wr,conscious:e}={}){const r=Xr(e),n=s[t];return Lr(Vr("dodge"),(({lastPlies:t,ply:e,before:o,after:i})=>{const{pid:s}=e,c=t[0]&&t[0].pid,a=ze(o,s,c)||ze(i,s,c);let u=rn(n,o,s);return a||(u*=r),u-rn(n,i,s)}))}(e);case"protect":return function({valuing:t=Wr,conscious:e}={}){const r=Xr(e),n=s[t],o=function(t,e){return({lastPlies:r,before:n})=>{const o=function({lastPlies:t,before:e}){if(0===t.length)return()=>!1;const r=new Set([...je(e,t[0].pid)].map((t=>t.captured)));return t=>r.has(t)}({lastPlies:r,before:n});return(r,n)=>{const i=t(r,n);return o(n)?i:i*e}}}(n,r);return Lr(Vr("protect"),(({ply:t,before:e,after:r,t:i})=>{const{pid:s,captured:c}=t,a=nn(r,s),u=i.memoize(Jr,o),l=!a&&D(c)?function(t,e,r){let n=0;for(const o of je(e,r)){if(J(o.captured))continue;const r=e.preview(o);let i=t(r,o.captured);nn(r,o.pid)&&(i-=t(r,o.pid)),n=Math.max(n,i)}return n}(n,e,c):0,f=a?0:tn(r,e,s,u),h=tn(e,r,s,u);return Math.max(l,f)-h}))}(e);case"check":return Lr(Vr("check"),(({ply:t,after:e})=>{const{pid:r}=t;for(const{captured:t}of je(e,r))if(J(t))return Fr;return 0}));case"chase":return Lr(Vr("chase"),(({ply:t,before:e,after:r})=>{const{pid:n,captured:o}=t,i=en(r,n)?Fr:0;return!D(o)&&en(e,n)?i-Fr:i}));case"win":return on;default:throw new Error(`Unrecognized ability config: ${t}.`)}}(t,e),r)}(t,c,i[t]))));return a=function(t,{abilities:e}){const r=[];return e.chase>0&&r.push({predicate:un,maxScore:0}),void 0===e.dodge&&e.capture>0&&r.push({predicate:an,maxScore:-100}),r.length>0&&(t=t.softbans(r)),t}(a,t),new Pr(new Or({config:t,heuristic:a}))}class pn{#z;constructor(t,e){this.#z=e,this.color=t,Object.freeze(this)}subscribe(t){const e=({data:{name:e,event:r}})=>t(e,r);return this.#z.addEventListener("message",e),()=>this.#z.removeEventListener("message",e)}send(t,e){this.#z.postMessage({name:t,data:e})}}Object.assign(pn.prototype,kr),async function(t){const{color:e,config:r}=await async function(t){return new Promise((e=>{const r=({data:n={}})=>{void 0!==n.color&&void 0!==n.config&&(t.removeEventListener("message",r),e(n))};t.addEventListener("message",r)}))}(t),n=new pn(e,t);dn(hn(r)).handle=n}(self)}();