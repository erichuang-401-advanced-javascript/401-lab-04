const Categories = require('../categories/categories.js');

describe('Categories Model', () => {

  let categories;

  beforeEach(() => {
    categories = new Categories();
  });

  // How might we repeat this to check on types?
  it('sanitize() returns undefined with missing requirements', () => {
    const schema = categories.schema;
    var testRecord = {};
    for (var field in schema) {
      if (schema[field].required) {
        testRecord[field] = null;
      }
    }
    expect(categories.sanitize(testRecord)).toBeUndefined();
  });

  it('can post() a new category', () => {
    let obj = { name: 'Test Category' };
    return categories.create(obj)
      .then(record => {
        Object.keys(obj).forEach(key => {
          expect(record[key]).toEqual(obj[key]);
        });
      })
      .catch(e => console.error('ERR', e));
  });

  it('can get() a category', () => {
    let obj = { name: 'Test Category' };
    return categories.create(obj)
      .then(record => {
        return categories.get(record.id);
      })
      .then(category => {
        Object.keys(obj).forEach(key => {
          expect(category[0][key]).toEqual(obj[key]);
        });
      });
  });

  test('deletes a new category', () => {
    let obj = { name : 'test' };
    let objdelete = { name : 'delete' };
    return categories.create(obj)
      .then( () => {
        return categories.create(objdelete);
      })
      .then( record => {
        return categories.delete( record.id );
      })
      .then( id => {
        categories.database.forEach( record => {
          expect( record.id === id ).toEqual(false);
        });
      });
  });

  test('updates an existing category', () => {
    let obj = { name : 'test' };
    let update = { name : 'update', cool : false };
    return categories.create( obj )
      .then( record => {
        let firstRecord = categories.database.filter( object => {
          return object.id === record.id;
        });
        expect(firstRecord[0].name).toEqual('test');
        return categories.update( record.id, update );
      })
      .then( record => {
        let newRecord = categories.database.filter( object => {
          return object.id === record.id;
        });
        console.log(record);
        expect(newRecord[0].name).toEqual('update');
      })

  });

});