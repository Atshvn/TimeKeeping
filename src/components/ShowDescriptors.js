import React, { useEffect, useState } from 'react';

const  ShowDescriptors = ({fullDesc = null}) => {

  const [descriptors, setDescriptors] = useState(null);
  // useMemo(() => { update(); }, []);
  useEffect(() => {
    update();
  }, []);

  useEffect(() => {
    update(fullDesc);
  }, [fullDesc]);
 
 

  const update = (ff) => {
    console.log(ff, 'fullDesc');
    if (!!ff) {
      setDescriptors(ff.map(fd => fd.descriptor));
    }
  };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'center',
          alignItems: 'center'
        }}
      >
        <h3>Detail Descriptions</h3>
        {!!descriptors
          ? descriptors.map((descriptor, i) => (
              <p
                key={i}
                style={{
                  padding: 10,
                  margin: 20,
                  wordBreak: 'break-all',
                  borderStyle: 'solid',
                  borderColor: 'blue'
                }}
              >
                <strong>Descriptor_{i}: </strong>
                {descriptor.toString()}
              </p>
            ))
          : null}
      </div>
    );
}

export default ShowDescriptors;
