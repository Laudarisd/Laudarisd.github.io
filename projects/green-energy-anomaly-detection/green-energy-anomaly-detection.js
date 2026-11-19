/* Green Energy Anomaly Detection: card and detail-page content in both languages.
   This folder holds everything for the project: index.html (page), green-energy-anomaly-detection.js (content),
   the thumbnail, and any case-study Markdown and images. */
Portfolio.project("green-energy-anomaly-detection", {
  en: {
    "title": "Green Energy Anomaly Detection",
    "description": "Wind and solar plant data from AWS into MongoDB on an Airflow schedule; Random Forest and LightGBM demand forecasts and an LSTM autoencoder for inverter anomalies.",
    "image": "thumbnail.jpg",
    "image_alt": "Green energy anomaly detection",
    "image_class": "",
    "url": "https://github.com/Laudarisd/Data-Science/tree/main/Project-4.Anomaly_Detection/1.LSTM_AutoEncoder",
    "subtitle": "Energy analytics from generation to consumption. Plant and meter data collected on an AWS data server, extracted into MongoDB and refreshed by Apache Airflow, feeding a Random Forest that forecasts daily electricity demand 1 to 30 days ahead (test MAPE 1.1–1.7 %), and a multivariate LSTM autoencoder that reconstructs solar inverter and weather signals and flags global and local anomalies with static and rolling thresholds, served through a Flask API.",
    "links": [
      {
        "label": "GitHub · LSTM autoencoder",
        "url": "https://github.com/Laudarisd/Data-Science/tree/main/Project-4.Anomaly_Detection/1.LSTM_AutoEncoder"
      },
      {
        "label": "GitHub · demand forecasting",
        "url": "https://github.com/Laudarisd/Data-Science/tree/main/Project-3.Energy_Data_Analysis"
      }
    ],
    "tags": [
      "Time-Series",
      "Random Forest",
      "LightGBM",
      "LSTM Autoencoder",
      "Anomaly Detection",
      "pandas",
      "scikit-learn",
      "TensorFlow / Keras",
      "Flask",
      "MongoDB",
      "Apache Airflow",
      "AWS"
    ]
  },
  kr: {
    "title": "Green Energy Anomaly Detection",
    "description": "풍력·태양광 플랜트 데이터를 AWS에서 MongoDB로, Airflow 스케줄로 가져와요. Random Forest와 LightGBM 수요 예측, LSTM 오토인코더 인버터 이상 탐지예요.",
    "image": "thumbnail.jpg",
    "image_alt": "그린 에너지 Anomaly Detection",
    "image_class": "",
    "url": "https://github.com/Laudarisd/Data-Science/tree/main/Project-4.Anomaly_Detection/1.LSTM_AutoEncoder",
    "subtitle": "발전에서 소비까지의 에너지 분석이에요. 플랜트와 계량 데이터를 AWS 데이터 서버에서 모아 MongoDB로 추출하고 Apache Airflow로 갱신해요. 그 위에서 일별 전력 수요를 1~30일 앞까지 예측하는 Random Forest(테스트 MAPE 1.1~1.7 %)와, 태양광 인버터·기상 신호를 재구성해 정적·이동 임계값으로 전역·지역 이상을 찾아내고 Flask API로 제공하는 다변량 LSTM 오토인코더예요.",
    "links": [
      {
        "label": "GitHub · LSTM 오토인코더",
        "url": "https://github.com/Laudarisd/Data-Science/tree/main/Project-4.Anomaly_Detection/1.LSTM_AutoEncoder"
      },
      {
        "label": "GitHub · 수요 예측",
        "url": "https://github.com/Laudarisd/Data-Science/tree/main/Project-3.Energy_Data_Analysis"
      }
    ],
    "tags": [
      "Time-Series",
      "Random Forest",
      "LightGBM",
      "LSTM Autoencoder",
      "Anomaly Detection",
      "pandas",
      "scikit-learn",
      "TensorFlow / Keras",
      "Flask",
      "MongoDB",
      "Apache Airflow",
      "AWS"
    ]
  }
});
