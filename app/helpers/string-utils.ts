export function capitalize(target: string): string {
  switch (target) {
    case undefined:
    case null:
    case "":
      return target;
    default:
      return (
        target[0].toLocaleUpperCase() + target.substring(1).toLocaleLowerCase()
      );
  }
}
