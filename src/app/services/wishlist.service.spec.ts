import { TestBed } from '@angular/core/testing';
import { WishlistService } from './wishlist.service';
import { AccountService } from './account.service';
import { CATALOG } from '../data/catalog';
describe('Wishlist saving',()=>{
 let saved:string|null;
 beforeEach(()=>{saved=localStorage.getItem('al_amin_wishlist_v1');localStorage.removeItem('al_amin_wishlist_v1');TestBed.configureTestingModule({});});
 afterEach(()=>{if(saved===null)localStorage.removeItem('al_amin_wishlist_v1');else localStorage.setItem('al_amin_wishlist_v1',saved);});
 it('toggles real products without duplicates and persists changes',()=>{const service=TestBed.inject(WishlistService);const account=TestBed.inject(AccountService);account.user.set(null);const p=CATALOG[0];service.toggle(p.id);expect(service.products()).toEqual([p]);expect(service.isSaved(p.id)).toBeTrue();expect(JSON.parse(localStorage.getItem('al_amin_wishlist_v1')!).guest).toEqual([p.id]);service.toggle(p.id);expect(service.products()).toEqual([]);});
 it('isolates saved items between guest and signed-in accounts',()=>{const service=TestBed.inject(WishlistService);const account=TestBed.inject(AccountService);account.user.set(null);service.toggle(CATALOG[0].id);account.user.set({id:'wishlist-test',name:'Test',email:'test@example.test',phone:'',address:'',city:''});expect(service.products()).toEqual([]);service.toggle(CATALOG[1].id);expect(service.products()).toEqual([CATALOG[1]]);account.user.set(null);expect(service.products()).toEqual([CATALOG[0]]);});
 it('ignores products outside the catalogue',()=>{const service=TestBed.inject(WishlistService);service.toggle('not-a-product');expect(service.products()).toEqual([]);});
});