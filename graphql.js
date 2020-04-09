const gql = require('graphql-tag');
const { print } = require('graphql');

const FACE_FRAGMENT = gql`
  fragment FaceFragment on ThumbFace {
    id
    confidence
    top
    bottom
    left
    right
    width
    height
    brightness
    sharpness
    roll
    yaw
    pitch
    smile
    smileConfidence
    eyesOpen
    eyesOpenConfidence
    mouthOpen
    mouthOpenConfidence
    happy
    happyConfidence
    sad
    sadConfidence
    angry
    angryConfidence
    confused
    confusedConfidence
    disgusted
    disgustedConfidence
    surprised
    surprisedConfidence
    calm
    calmConfidence
    unknown
    unknownConfidence
    fear
    fearConfidence
  }
`;

const FACES_FRAGMENT = gql`
  fragment FacesFragment on Thumb {
    facesCount
    faces {
      ...FaceFragment
    }
  }
`;

const BIGGEST_FACE_FRAGMENT = gql`
  fragment BiggestFaceFragment on Thumb {
    biggestFace {
      ...FaceFragment
    }
  }
`;

const SECOND_BIGGEST_FACE_FRAGMENT = gql`
  fragment SecondBiggestFaceFragment on Thumb {
    secondBiggestFace {
      ...FaceFragment
    }
  }
`;

const THIRD_BIGGEST_FACE_FRAGMENT = gql`
  fragment ThirdBiggestFaceFragment on Thumb {
    thirdBiggestFace {
      ...FaceFragment
    }
  }
`;

const MATCHES_FRAGMENT = gql`
  fragment MatchesFragment on Thumb {
    matches {
      id
      confidence
      name
    }
  }
`;

const CELEBRITIES_FRAGMENT = gql`
  fragment CelebritiesFragment on Thumb {
    celebrities {
      id
      confidence
      name
    }
  }
`;
const LABELS_FRAGMENT = gql`
  fragment LabelsFragment on Thumb {
    labels {
      id
      confidence
      name
      top
      left
      bottom
      right
      width
      height
      parentsCount
    }
  }
`;

const TEXTS_FRAGMENT = gql`
  fragment TextsFragment on Thumb {
    texts {
      id
      confidence
      name
      top
      left
      bottom
      right
      width
      height
    }
  }
`;

function makeThumbsQuery(fields) {
  const usesFaces = fields.find(it => it.toLowerCase().includes('face'));

  return print(gql`
    query thumbs($where: ThumbWhereInput, $skip: Int, $first: Int) {
      thumbs(where: $where, skip: $skip, first: $first) {
        id
        ${fields.includes('url') ? 'url' : ''}
        ${fields.includes('start') ? 'start' : ''}
        ${fields.includes('diff') ? 'notFound' : ''}
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

    ${usesFaces ? FACE_FRAGMENT : ''}
    ${fields.includes('faces') ? FACES_FRAGMENT : ''}
    ${fields.includes('biggestFace') ? BIGGEST_FACE_FRAGMENT : ''}
    ${fields.includes('secondBiggestFace') ? SECOND_BIGGEST_FACE_FRAGMENT : ''}
    ${fields.includes('thirdBiggestFace') ? THIRD_BIGGEST_FACE_FRAGMENT : ''}
    ${fields.includes('matches') ? MATCHES_FRAGMENT : ''}
    ${fields.includes('celebrities') ? CELEBRITIES_FRAGMENT : ''}
    ${fields.includes('labels') ? LABELS_FRAGMENT : ''}
    ${fields.includes('texts') ? TEXTS_FRAGMENT : ''}
  `);
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

module.exports = {
  makeThumbsQuery,
  THUMBS_CONNECTION
};
