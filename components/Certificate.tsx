import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Svg, Path, Font } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
    },
    border: {
        border: '4px solid #4F46E5', // Indigo-600
        padding: 20,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: 20,
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginLeft: 10,
    },
    title: {
        fontSize: 20,
        color: '#4F46E5',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    content: {
        flexDirection: 'row',
        gap: 20,
        flexGrow: 1,
    },
    leftColumn: {
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightColumn: {
        width: '60%',
        paddingLeft: 20,
        borderLeft: '1px solid #E2E8F0',
        justifyContent: 'center',
    },
    productImage: {
        width: '100%',
        height: 200,
        objectFit: 'contain',
        borderRadius: 8,
    },
    label: {
        fontSize: 10,
        color: '#64748B', // Slate-500
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 15,
        marginBottom: 4,
    },
    value: {
        fontSize: 14,
        color: '#0F172A', // Slate-900
        fontWeight: 'medium',
    },
    valueSmall: {
        fontSize: 10,
        color: '#334155',
        fontFamily: 'Courier',
    },
    footer: {
        marginTop: 40,
        borderTop: '1px solid #E2E8F0',
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    qrSection: {
        alignItems: 'center',
    },
    qrCode: {
        width: 60,
        height: 60,
    },
    footerText: {
        fontSize: 8,
        color: '#94A3B8',
        marginTop: 5,
    },
    stampObj: {
        width: 80,
        height: 80,
        position: 'absolute',
        bottom: 40,
        right: 40,
        opacity: 0.1
    },
    verifiedBadge: {
        backgroundColor: '#F0FDF4', // Green-50
        padding: '4 8',
        borderRadius: 4,
        border: '1px solid #BBF7D0',
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    verifiedText: {
        color: '#166534', // Green-700
        fontSize: 10,
        fontWeight: 'bold',
    }
});

interface CertificateProps {
    data: {
        productName: string;
        brand: string;
        serialNumber: string;
        productImage: string | null;
        ownerEmail: string;
        verifiedAt: string;
        txHash: string;
        qrCodeUrl: string;
        verificationId: string;
    };
}

export const Certificate = ({ data }: CertificateProps) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.border}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        {/* Simple Shield Icon SVG */}
                        <Svg width="24" height="24" viewBox="0 0 24 24">
                            <Path
                                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                                fill="#4F46E5"
                            />
                        </Svg>
                        <Text style={styles.logoText}>A-Capp</Text>
                    </View>
                    <Text style={styles.title}>Certificate of Authenticity</Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Left Column - Image */}
                    <View style={styles.leftColumn}>
                        {data.productImage ? (
                            <Image src={data.productImage} style={styles.productImage} />
                        ) : (
                            <View style={{ width: 150, height: 150, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
                                <Text style={{ color: '#94A3B8' }}>No Image</Text>
                            </View>
                        )}

                        <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>✓ VERIFIED AUTHENTIC</Text>
                        </View>
                    </View>

                    {/* Right Column - Details */}
                    <View style={styles.rightColumn}>
                        <View>
                            <Text style={styles.label}>Brand</Text>
                            <Text style={styles.value}>{data.brand}</Text>
                        </View>

                        <View>
                            <Text style={styles.label}>Product Name</Text>
                            <Text style={styles.value}>{data.productName}</Text>
                        </View>

                        <View>
                            <Text style={styles.label}>Serial Number</Text>
                            <Text style={styles.value}>{data.serialNumber}</Text>
                        </View>

                        <View>
                            <Text style={styles.label}>Certificate Holder</Text>
                            <Text style={styles.value}>{data.ownerEmail}</Text>
                        </View>

                        <View>
                            <Text style={styles.label}>Authentication Date</Text>
                            <Text style={styles.value}>{data.verifiedAt}</Text>
                        </View>

                        <View>
                            <Text style={styles.label}>Blockchain Transaction Hash</Text>
                            <Text style={styles.valueSmall}>{data.txHash || 'Pending Blockchain Confirmation'}</Text>
                        </View>

                        <View>
                            <Text style={styles.label}>Verification ID</Text>
                            <Text style={styles.valueSmall}>{data.verificationId}</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View>
                        <Text style={{ fontSize: 10, color: '#64748B' }}>Secured by A-Capp Protocol</Text>
                        <Text style={{ fontSize: 8, color: '#94A3B8', marginTop: 4 }}>Immutable Ledger Technology • Polygon Network</Text>
                    </View>

                    <View style={styles.qrSection}>
                        {data.qrCodeUrl && (
                            <Image src={data.qrCodeUrl} style={styles.qrCode} />
                        )}
                        <Text style={styles.footerText}>Review on A-Capp</Text>
                    </View>
                </View>

            </View>
        </Page>
    </Document>
);
