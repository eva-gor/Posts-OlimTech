export default function likesDislikesAction(ar1: string[], ar2: string[], username: string) {
    const index1 = ar1.indexOf(username);
    if (index1 > -1) {
      ar1.splice(index1, 1);
    } else {
      ar1.push(username);

      const index2 = ar2.indexOf(username);
      if (index2 > -1) {
        ar2.splice(index2, 1);
      }
    }
    return { ar1, ar2 };
  }