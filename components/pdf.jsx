"use client";
import React, { Fragment } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/fonts/Roboto-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/Roboto-Medium.ttf",
      fontWeight: 500,
    },
    {
      src: "/fonts/Roboto-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  PDFViewer: { width: "100%", height: "80vh" },
  Document: { width: "100%", height: "100%", fontFamily: "Roboto" },
  page: { width: "100%", height: "100%" },
  section: { textAlign: "center", margin: 30 },
  rowView: {
    fontSize: 14,
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

// Create Document Component
const MyDocument = () => {
  const tableData = {
    column: ["Suggested Medicine", "Dosage", "Duration"],
    data: [
      {
        "Suggested Medicine": "1",
        Dosage: "2",
        Duration: "3",
      },
      {
        "Suggested Medicine": "1",
        Dosage: "3",
        Duration: "89",
      },
    ],
  };

  const petData = [
    {
      Name: "Pet Name",
      Data: "Nemo",
    },
    {
      Name: "Consultant",
      Data: "Dr. John Doe",
    },
    {
      Name: "Prescription ID",
      Data: "1",
    },
    {
      Name: "Date",
      Data: "2-10-23",
    },

    {
      Name: "Species",
      Data: "Dog",
    },
    {
      Name: "Breed",
      Data: "Poodle",
    },
    {
      Name: "Pet Age",
      Data: "2",
    },
    {
      Name: "Pet Weight",
      Data: "3 kg",
    },
  ];

  return (
    <Document style={styles.Document}>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={{ color: "orange", fontWeight: "bold" }}>
            Whisker Docs | Prescription
          </Text>
        </View>

        <Image
          src="https://th.bing.com/th/id/OIP.kD-ISqjfhq_q0oMg3v4XZgHaH8?pid=ImgDet&rs=1"
          style={{
            width: "100px",
            height: "100px",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "3px",
            marginBottom: "30",
          }}
        />

        <View style={{ marginBottom: 40 }}>
          {petData.map((rowData, index) => (
            <>
              <View
                style={{
                  fontSize: 12,
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Text
                  style={{
                    width: `${100 / 4}%`,
                    backgroundColor: index % 2 == 0 ? "#f2f2f2" : "white",
                    paddingTop: 7,
                    paddingBottom: 7,
                    paddingLeft: 10,
                    color: "#444444",
                    fontWeight: "bold",
                  }}
                >
                  {rowData.Name}
                </Text>
                <Text
                  style={{
                    width: `${100 / 4}%`,
                    backgroundColor: index % 2 == 0 ? "#f2f2f2" : "white",
                    paddingTop: 7,
                    paddingBottom: 7,
                    color: "#808080",
                    fontWeight: "semibold",
                  }}
                >
                  {rowData.Data}
                </Text>
              </View>
            </>
          ))}
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            color: "#444444",
            fontSize: 12,
            gap: 30,
            marginBottom: 40,
            fontWeight: "bold",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 18,
                marginBottom: 10,
                fontWeight: "bold",
                color: "orange",
              }}
            >
              Symptoms
            </Text>
            <View style={{ display: "flex", flexDirection: "column" }}>
              <View style={{ flexDirection: "row", marginBottom: 4 }}>
                <Text style={{ marginHorizontal: 8 }}>•</Text>
                <Text>Fever</Text>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 4 }}>
                <Text style={{ marginHorizontal: 8 }}>•</Text>
                <Text>Runny Nose</Text>
              </View>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 10,
                fontWeight: "bold",
                color: "orange",
              }}
            >
              Diseases
            </Text>
            <View style={{ display: "flex", flexDirection: "column" }}>
              <View style={{ flexDirection: "row", marginBottom: 4 }}>
                <Text style={{ marginHorizontal: 8 }}>•</Text>
                <Text>Flu</Text>
              </View>
            </View>
          </View>
        </View>

        <Fragment>
          <View style={styles.rowView}>
            {tableData["column"].map((c) => (
              <Text
                style={{
                  width: `${100 / tableData["column"].length}%`,
                  backgroundColor: "#2f327d",
                  color: "white",
                  fontWeight: "bold",
                  paddingTop: 5,
                  paddingBottom: 5,
                }}
              >
                {c}
              </Text>
            ))}
          </View>
          {tableData["data"].map((rowData, index) => (
            <>
              <View style={styles.rowView}>
                {tableData["column"].map((c) => (
                  <Text
                    style={{
                      width: `${100 / tableData["column"].length}%`,
                      backgroundColor: index % 2 == 0 ? "white" : "#f2f2f2",
                      paddingTop: 5,
                      paddingBottom: 5,
                    }}
                  >
                    {rowData[c]}
                  </Text>
                ))}
              </View>
            </>
          ))}
        </Fragment>
      </Page>
    </Document>
  );
};

export default function MyPDF() {
  return (
    <PDFViewer style={styles.PDFViewer}>
      <MyDocument />
    </PDFViewer>
  );
}
