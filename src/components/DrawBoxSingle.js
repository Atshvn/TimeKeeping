
import React, {  useState, useEffect} from 'react';

const  DrawBoxSingle = ({
  fullDesc = null,
  faceMatcher = null,
  boxColor = '#ed4242',
  imageWidth = 0,
  showLabel = true,
  bl = '', //blob 
  onMatch= () => {}
}) => {
  const [descriptors, setDescriptors] = useState(null);
  const [detections, setDetections] = useState(null);
  const [match, setMatch] = useState(null);


  
  useEffect(() => {
    getDescription()
  }, [fullDesc, faceMatcher]);

  const getDescription = async () => {
    
    if (fullDesc && Object.values(fullDesc).length > 0) {
      setDescriptors(fullDesc.descriptor);
      setDetections(fullDesc.detection);
      let des =fullDesc.descriptor;
      let det = fullDesc.detection; 

      const relativeBox = det.relativeBox;
      const dimension = det._imageDims;
      let _W = imageWidth * relativeBox.width;
      let _H =
        (relativeBox.height * imageWidth * dimension._height) /
        dimension._width;
      if (!!des && !!det) {
        let match = faceMatcher.findBestMatch(des)
    
        setMatch(match);
        if(Object.values(fullDesc).length > 0){
          onMatch(match, fullDesc.descriptor, _W, _H, bl)
        }
        else{
          onMatch(match, '')
        }
      }
      return
    }
   
  };
 


  if (!!detections) {
      const relativeBox = detections.relativeBox;
      const dimension = detections._imageDims;
     
      let _X = imageWidth * relativeBox._x;
      let _Y =
        (relativeBox._y * imageWidth * dimension._height) / dimension._width;
      let _W = imageWidth * relativeBox.width;
      let _H =
        (relativeBox.height * imageWidth * dimension._height) /
        dimension._width;
      return (
        <div>
          <div
            style={{
              position: 'absolute',
              border: 'solid',
              borderColor: boxColor,
              height: _H,
              width: _W,
              transform: `translate(${_X}px,${_Y}px)`
            }}
            // className= {showLabel ? '' : 'd-none'}
          >
            {!!match && match && match._label !== 'unknown' ? (
              <p
                style={{
                  backgroundColor: boxColor,
                  border: 'solid',
                  borderColor: boxColor,
                  width: _W,
                  marginTop: 0,
                  color: '#fff',
                  transform: `translate(-3px,${_H}px)`
                }}
                 className= {showLabel ? '' : 'd-none'}
              >
                {match._label}
              </p>
            ) : null}
          </div>
        </div>
      );
  }

  return <div></div>;
}

// class DrawBox extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       descriptors: null,
//       detections: null,
//       match: null
//     };
//   }

//   componentDidMount() {
//     this.getDescription();
//   }

//   componentWillReceiveProps(newProps) {
//     this.getDescription(newProps);
//   }
  

//   getDescription = async (props = this.props) => {
//     const { fullDesc, faceMatcher } = props;
//     if (!!fullDesc) {
//       await this.setState({
//         descriptors: fullDesc.map(fd => fd.descriptor),
//         detections: fullDesc.map(fd => fd.detection)
//       });
//       if (!!this.state.descriptors && !!faceMatcher) {
//         let match = await this.state.descriptors.map(descriptor =>
//           faceMatcher.findBestMatch(descriptor)
//         );
//         this.setState({ match });
//       }
      
//       console.log( this.state.descriptors)
//       console.log( this.state.match, 'match');
//     }
//   };
  

//   render() {
//     const { imageWidth, boxColor } = this.props;
//     const { detections, match } = this.state;
//     let box = null;

//     if (!!detections) {
//       box = detections.map((detection, i) => {
//         const relativeBox = detection.relativeBox;
//         const dimension = detection._imageDims;
//         let _X = imageWidth * relativeBox._x;
//         let _Y =
//           (relativeBox._y * imageWidth * dimension._height) / dimension._width;
//         let _W = imageWidth * relativeBox.width;
//         let _H =
//           (relativeBox.height * imageWidth * dimension._height) /
//           dimension._width;
//         return (
//           <div key={i}>
//             <div
//               style={{
//                 position: 'absolute',
//                 border: 'solid',
//                 borderColor: boxColor,
//                 height: _H,
//                 width: _W,
//                 transform: `translate(${_X}px,${_Y}px)`
//               }}
//             >
//               {!!match && match[i] && match[i]._label !== 'unknown' ? (
//                 <p
//                   style={{
//                     backgroundColor: boxColor,
//                     border: 'solid',
//                     borderColor: boxColor,
//                     width: _W,
//                     marginTop: 0,
//                     color: '#fff',
//                     transform: `translate(-3px,${_H}px)`
//                   }}
//                 >
//                   {match[i]._label}
//                 </p>
//               ) : null}
//             </div>
//           </div>
//         );
//       });
//     }

//     return <div>{box}</div>;
//   }
// }


export default DrawBoxSingle;
