import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

/**
 * Generated class for the ProdutosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[] = [];
  page: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public produtoService: ProdutoService,
     public loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  public getSmallImageIfExists(start: number, end: number){
    for(var i = start; i < end; i++){
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id).subscribe(
        response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`
        },
        error => {}
      );
    }
  }

  public loadData(){
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(this.navParams.get("categoria_id"), this.page, 10).subscribe(
      response => {
        let start = this.items.length;
        this.items = this.items.concat(response['content']);
        let end = this.items.length;
        loader.dismiss();
        this.getSmallImageIfExists(start, end);
      },
      error =>{ loader.dismiss(); }
    );
  }
  
  public showDetail(id: string){
    this.navCtrl.push("ProdutoDetailPage", {produto_id: id});
  }

  presentLoading() {
    let loader = this.loadingController.create({
      content: "Please wait..."
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }

}
