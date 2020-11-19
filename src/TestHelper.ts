class TestHelper {
  public static sortObjectListReverseChronologically(objects: object[], property: string): any[] {
    return this.sortObjectListByDateChronologically(objects, property).reverse()
  }

  public static sortObjectListByDateChronologically(objects: object[], property: string): any[] {
    if (objects.some(obj => obj[property] === undefined)) {
      return null
    }
    return objects.sort((a, b) => {
      return new Date(a[property]).getTime() > new Date(b[property]).getTime() ? 1 : -1
    })
  }
}

export default TestHelper
