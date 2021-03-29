class TestHelper {
    static sortObjectListReverseChronologically(objects, property) {
        return this.sortObjectListByDateChronologically(objects, property).reverse();
    }
    static sortObjectListByDateChronologically(objects, property) {
        if (objects.some(obj => obj[property] === undefined)) {
            return null;
        }
        return objects.sort((a, b) => {
            return new Date(a[property]).getTime() > new Date(b[property]).getTime() ? 1 : -1;
        });
    }
}
export default TestHelper;
//# sourceMappingURL=TestHelper.js.map