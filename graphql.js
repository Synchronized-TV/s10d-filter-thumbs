const faceFields = [
  'confidence',
  'top',
  'bottom',
  'left',
  'right',
  'width',
  'height',
  'brightness',
  'sharpness',
  'roll',
  'yaw',
  'pitch',
  'smile',
  'smileConfidence',
  'eyesOpen',
  'eyesOpenConfidence',
  'mouthOpen',
  'mouthOpenConfidence',
  'happy',
  'happyConfidence',
  'sad',
  'sadConfidence',
  'angry',
  'angryConfidence',
  'confused',
  'confusedConfidence',
  'disgusted',
  'disgustedConfidence',
  'surprised',
  'surprisedConfidence',
  'calm',
  'calmConfidence',
  'unknown',
  'unknownConfidence',
  'fear',
  'fearConfidence'
];

const personFields = [
  'confidence',
  'name'
];

const labelFields = [
  'confidence',
  'name',
  'top',
  'left',
  'bottom',
  'right',
  'width',
  'height',
  'parentsCount'
];

const textFields = [
  'confidence',
  'name',
  'top',
  'left',
  'bottom',
  'right',
  'width',
  'height'
];

const thumbFields = [
  'start',
  'end',
  'url',
  'brightness',
  'sharpness',
  'quality',
  'facesCount',
  'faces',
  'biggestFace',
  'secondBiggestFace',
  'thirdBiggestFace',
  'matches',
  'celebrities',
  'labels',
  'texts',
  ...faceFields,
  ...personFields,
  ...labelFields,
  ...textFields
];

const FACE_FRAGMENT = (fields) => `
  fragment FaceFragment on ThumbFace {
    id ${fields.filter(it => faceFields.includes(it)).join(' ')}
  }
`;

const FACES_FRAGMENT = `
  fragment FacesFragment on Thumb {
    facesCount
    faces {
      ...FaceFragment
    }
  }
`;

const BIGGEST_FACE_FRAGMENT = `
  fragment BiggestFaceFragment on Thumb {
    biggestFace {
      ...FaceFragment
    }
  }
`;

const SECOND_BIGGEST_FACE_FRAGMENT = `
  fragment SecondBiggestFaceFragment on Thumb {
    secondBiggestFace {
      ...FaceFragment
    }
  }
`;

const THIRD_BIGGEST_FACE_FRAGMENT = `
  fragment ThirdBiggestFaceFragment on Thumb {
    thirdBiggestFace {
      ...FaceFragment
    }
  }
`;

const MATCHES_FRAGMENT = (fields) => `
  fragment MatchesFragment on Thumb {
    matches {
      id ${fields.filter(it => personFields.includes(it)).join(' ')}
    }
  }
`;

const CELEBRITIES_FRAGMENT = (fields) => `
  fragment CelebritiesFragment on Thumb {
    celebrities {
      id ${fields.filter(it => personFields.includes(it)).join(' ')}
    }
  }
`;
const LABELS_FRAGMENT = (fields) => `
  fragment LabelsFragment on Thumb {
    labels {
      id ${fields.filter(it => labelFields.includes(it)).join(' ')}
    }
  }
`;

const TEXTS_FRAGMENT = (fields) => `
  fragment TextsFragment on Thumb {
    texts {
      id ${fields.filter(it => textFields.includes(it)).join(' ')}
    }
  }
`;

function makeThumbsQuery(fields) {
  const usesFaces = fields.find(it => it.toLowerCase().includes('face'));

  return `
    query thumbs($where: ThumbWhereInput, $skip: Int, $first: Int) {
      thumbs(where: $where, skip: $skip, first: $first, orderBy: start_ASC) {
        id
        ${fields.includes('url') ? 'url' : ''}
        ${fields.includes('start') ? 'start' : ''}
        ${fields.includes('end') ? 'end' : ''}
        ${fields.includes('quality') ? 'quality' : ''}
        ${fields.includes('brightness') ? 'brightness' : ''}
        ${fields.includes('sharpness') ? 'sharpness' : ''}
        ${fields.includes('faces') ? '...FacesFragment' : ''}
        ${fields.includes('biggestFace') ? '...BiggestFaceFragment' : ''}
        ${
  fields.includes('secondBiggestFace')
    ? '...SecondBiggestFaceFragment'
    : ''
}
        ${
  fields.includes('thirdBiggestFace')
    ? '...ThirdBiggestFaceFragment'
    : ''
}
        ${fields.includes('matches') ? '...MatchesFragment' : ''}
        ${fields.includes('celebrities') ? '...CelebritiesFragment' : ''}
        ${fields.includes('labels') ? '...LabelsFragment' : ''}
        ${fields.includes('texts') ? '...TextsFragment' : ''}
      }
    }

    ${usesFaces ? FACE_FRAGMENT(fields) : ''}
    ${fields.includes('faces') ? FACES_FRAGMENT : ''}
    ${fields.includes('biggestFace') ? BIGGEST_FACE_FRAGMENT : ''}
    ${fields.includes('secondBiggestFace') ? SECOND_BIGGEST_FACE_FRAGMENT : ''}
    ${fields.includes('thirdBiggestFace') ? THIRD_BIGGEST_FACE_FRAGMENT : ''}
    ${fields.includes('matches') ? MATCHES_FRAGMENT(fields) : ''}
    ${fields.includes('celebrities') ? CELEBRITIES_FRAGMENT(fields) : ''}
    ${fields.includes('labels') ? LABELS_FRAGMENT(fields) : ''}
    ${fields.includes('texts') ? TEXTS_FRAGMENT(fields) : ''}
  `;
};

const THUMBS_CONNECTION = `
  query thumbsConnection(
    $where: ThumbWhereInput
  ) {
    thumbsConnection(
      where: $where
    ) {
      aggregate {
        count
      }
    }
  }`;

  
const VIDEO = `
  query video($id: UUID!) {
    video(where: { id: $id }) {
      id
      title
      duration
      project { thumbsPresets { videosPath videoStartInc videoEndInc } }
    }
  }`;

const CUE = `
  query cue($id: UUID!) {
    cue(where: { id: $id }) {
      start
      end
      video {
        id
        title
        project { thumbsPresets { videosPath videoStartInc videoEndInc } }
      }
    }
  }`;

module.exports = {
  thumbFields,
  makeThumbsQuery,
  THUMBS_CONNECTION,
  VIDEO,
  CUE
};
