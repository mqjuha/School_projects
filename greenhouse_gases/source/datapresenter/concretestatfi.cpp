#include "concretestatfi.hh"
#include "model.hh"

ConcreteStatfi::ConcreteStatfi(Model* model, QObject *parent) : QObject(parent)
  , model_(model)
{
    manager_ = new QNetworkAccessManager();
}

void ConcreteStatfi::fetchData(std::vector<std::string> timeRange, std::string gas, std::vector<std::string> location)
{
    if ( timeRange.size() > 1) {
        Q_UNUSED(location);

        // New time vector
        currentTimeRange_.clear();
        for (int i = std::stoi(timeRange[0]); i <= std::stoi(timeRange[1]); i++) {
            QDateTime dt = QDateTime::fromString(QString::fromStdString(std::to_string(i)), QString("yyyy"));
            currentTimeRange_.push_back(dt);
        }

        QByteArray query = generateQuery(gas, timeRange);
        post(query);
    }
}

std::vector<std::vector<double>> ConcreteStatfi::getCurrentData()
{
    return currentData_;
}

std::vector<QString> ConcreteStatfi::getSupportedTimeFrame()
{
    return supportedTimeFrame_;
}

std::vector<std::string> ConcreteStatfi::getSupportedStations()
{
    return {};
}

std::vector<std::string> ConcreteStatfi::getSupportedGases()
{
    return supportedGases_;
}

std::vector<QDateTime> ConcreteStatfi::getTimeVector()
{
    return currentTimeRange_;
}

QString ConcreteStatfi::getDatabaseName()
{
    return "STATFI";
}

void ConcreteStatfi::post(QByteArray data)
{
    QNetworkRequest request = QNetworkRequest(QUrl(url_));
    request.setHeader(QNetworkRequest::ContentTypeHeader, 0);
    QNetworkReply* reply = manager_->post(request, data);
    connect(reply, &QNetworkReply::readyRead, this, &ConcreteStatfi::readyRead);

}

void ConcreteStatfi::readyRead()
{

    // Haetaan raaka vastaus
    QNetworkReply* reply = qobject_cast<QNetworkReply*>(sender());

    if (reply->error() != QNetworkReply::NoError) {
        return;
    }

    QJsonDocument jsonResponse(QJsonDocument::fromJson(reply->readAll()));



    if (jsonResponse.isNull() || !jsonResponse.isObject()) {
        return;
    }

    QJsonObject jsonObject = jsonResponse.object();

    if (!jsonObject.contains("value")) {
        return;
    }

    // Find the unit.
    QJsonObject has_unit = jsonObject["dimension"].toObject()["Tiedot"].toObject()["category"].toObject()["index"].toObject();
    QString unit = "";
    if (has_unit.contains("Khk_yht")) {
        unit = "1000 t";
    } else if (has_unit.contains("Khk_yht_las")) {
        unit = "intensity";
    } else {
        unit = "indexed, 1990 = 100";
    }

    auto values = arrayToVector(jsonObject["value"].toArray());

    currentData_.clear();
    currentData_.push_back(values);

    model_->createCard(this, "yyyy", unit, "CO2");

    return;
}

QByteArray ConcreteStatfi::generateQuery(std::string data, std::vector<std::string> years)
{
        QByteArray query("{\"query\": [{\"code\": \"Tiedot\",\"selection\": {\"filter\": \"item\",\"values\": [");

        // Dynamically adds datasets to query
        query.append("\"" + toEncodedQuery(data) + "\",");


        query.append("]}},{\"code\": \"Vuosi\",\"selection\": {\"filter\": \"item\",\"values\": [");

        // Dynamically adds timerange to query
        for (int i = 0; i <= stoi(years.at(1)) - stoi(years.at(0)); ++i) {

            query.append("\"" + std::to_string(stoi(years.at(0)) + i) + "\",");
        }

        query.append("]}}]}");
        return query;
}

std::vector<double> ConcreteStatfi::arrayToVector(QJsonArray array)
{
    std::vector<double> dataVector = {};

    for (int i = 0; i < array.size(); i++) {
        dataVector.push_back(array[i].toDouble());
    }

    return dataVector;
}

std::string ConcreteStatfi::toEncodedQuery(std::string gas)
{
    if (gas == "CO2 in tonnes") {
        return "Khk_yht";
    }
    if (gas == "CO2 intensity") {
        return "Khk_yht_las";
    }
    if (gas == "CO2 indexed") {
        return "Khk_yht_index";
    }
    if (gas == "CO2 indensity indexed") {
        return "Khk_yht_las_index";
    }
    return "UNIT ERROR";
}
