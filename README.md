# passports-keystore
Store and retrieve named objects an express session

## Usage

```
const Keystore = require('hmpo-keystore');

keystore = new Keystore(req, 'name');

keystore.setValue({ object: 'value' });
let obj = keystore.getValue();
keystore.clear();

```
