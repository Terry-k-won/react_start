import {useState} from 'react';
import catalogData from './catalog.json';

function SearchBox({searchLine,setSearchLine}) {
  return <input type="text" placeholder = "Search.." value = {searchLine} onChange={(e) => setSearchLine(e.target.value)}></input>
}

function StockFilter({stockOnly, setStockOnly}) {
  return(
    <label>
      <input type="checkbox" checked={stockOnly} onChange={(e) => setStockOnly(e.target.checked)}></input>
        Only show products in stock
    </label>
   )
}

function FilterableProductTable({searchLine, setSearchLine, stockOnly, setStockOnly}) {
  return (
    <>
      <div><SearchBox searchLine={searchLine} setSearchLine={setSearchLine}/></div>
      <div><StockFilter stockOnly={stockOnly} setStockOnly={setStockOnly}/></div>
    </>
  )
}



function ProductCategoryRow({category}) {
  return(
    <tr>
      <th>
        {category}
      </th>
    </tr>
  );
}

function ProductRow({product}) {
  const name = product.stocked? product.name:
    <span style={{color: 'red'}}>
      {product.name}
    </span>;

  return(
    <tr>
      <td>
        {name}
      </td>
      <td>
        {product.price}
      </td>
    </tr>
  )
}

function ProductTable({products, stockOnly}) {
  const rows= [];
  let lastCategory = null;

  products.forEach((product) => {
    if(!stockOnly || product.stocked)
    {
      if(product.category !== lastCategory) {
        rows.push(
          <ProductCategoryRow 
          category={product.category}
          key={product.category}/>);
      }
      rows.push(
      <ProductRow 
      product={product}
      key={product.name}/>
      );
      lastCategory=product.category;
    } 
  })

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}




export default function MainPage() {
  const [searchLine, setSearchLine] = useState('');
  const [stockOnly, setStockOnly] = useState(false);
  return (
    <>
      <div>
        <FilterableProductTable searchLine={searchLine} setSearchLine={setSearchLine} stockOnly={stockOnly} setStockOnly={setStockOnly}/>
      </div>
      <div>
        <ProductTable products={catalogData} stockOnly={stockOnly}/>
      </div>
    </>
  );
};