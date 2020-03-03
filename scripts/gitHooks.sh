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

echo "cat \$1 | head -1 | grep -E '^\|#[0-9]+\|[A-Za-z/]+\|.+$'
    matchResult=\${?}
    if (( \$matchResult != 0 )); then
        echo \"Please Use this format for commit message \n|#<issueNo>|<pair1Name>/<pair2Name>|commit head\nexample: |#001|denis/ritche|commitHead\"
    fi
    exit \$matchResult" > .git/hooks/commit-msg

chmod +x .git/hooks/commit-msg