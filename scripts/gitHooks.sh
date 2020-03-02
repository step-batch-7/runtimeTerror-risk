#!/bin/bash

cat <<EOF > .git/hooks/pre-commit
npm run test
if [ \$? != 0 ]; then
    echo "\n \n check tests ...\nThere are some failing tests...\n"
    exit 1
fi

grep -rnw "//" ./src/*.js ./test/*.js *.js
if [ \$? == 0 ]; then
    echo "\n\n Clear your comments before commiting....\n\n"
    exit 1
fi
EOF

chmod +x .git/hooks/pre-commit

cat <<EOF > .git/hooks/commit-msg

test "" = "$(grep '^|#[0-9]\+|.\+|.' "$1")" && {
   echo 'commit message should be in this format : |#issueNumber|name| commit msg'
   exit 1
}

exit 0

EOF

chmod +x .git/hooks/commit-msg