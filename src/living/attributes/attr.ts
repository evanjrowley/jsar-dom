import { CreateXSMLType } from '../../xsml-interfaces';
import { setAnExistingAttributeValue } from '../helpers/attributes';
import { NodeImpl } from '../nodes/Node';

export class AttrImpl extends NodeImpl implements CreateXSMLType<Attr> {
  specified: boolean;

  #namespace: string | null;
  #namespacePrefix: string | null;
  #localName: string;
  #value: string;
  #element: Element | null;

  constructor(hostObject, _args, privateData) {
    super(hostObject, [], null);

    this.#namespace = privateData.namespace !== undefined ? privateData.namespace : null;
    this.#namespacePrefix = privateData.namespacePrefix !== undefined ? privateData.namespacePrefix : null;
    this.#localName = privateData.localName;
    this.#value = privateData.value !== undefined ? privateData.value : "";
    this.#element = privateData.element !== undefined ? privateData.element : null;

    this.nodeType = NodeImpl.prototype.ATTRIBUTE_NODE;
    this.specified = true;
  }

  get namespaceURI() {
    return this.#namespace;
  }

  get prefix() {
    return this.#namespacePrefix;
  }

  get localName() {
    return this.#localName;
  }

  get name() {
    return this._qualifiedName;
  }

  get nodeName() {
    return this._qualifiedName;
  }

  get value() {
    return this.#value;
  }
  set value(value: string) {
    setAnExistingAttributeValue(this, value);
  }
  _setValue(value: string) {
    this.#value = value;
  }

  get ownerElement() {
    return this.#element;
  }

  get _qualifiedName() {
    // https://dom.spec.whatwg.org/#concept-attribute-qualified-name
    if (this.#namespacePrefix === null) {
      return this.#localName;
    }

    return this.#namespacePrefix + ':' + this.#localName;
  }
}
