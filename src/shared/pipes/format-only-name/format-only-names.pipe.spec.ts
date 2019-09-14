import { FormatOnlyNamesPipe } from "./format-only-names.pipe";

describe('FormatOnlyNamesPipe', () => {
  it('create an instance', () => {
    const pipe = new FormatOnlyNamesPipe();
    expect(pipe).toBeTruthy();
  });
});
