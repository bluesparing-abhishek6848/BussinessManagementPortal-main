
import React from 'react';
import { Helmet } from 'react-helmet-async';
import {  imageUrl, makeSeoUrl } from '../../Constant';

interface SeoProps {
    title?: string;
    description?: string;
    keywords?: string;
    url?: string;
    image?: string;
}


const Seo: React.FC<SeoProps> = ({
    title = 'Aapka Future',
    description = 'Loan management platform - streamline your branch finances and collections.',
    keywords = 'loan, finance, aapkafuture, collection, dashboard, branch',
    url = makeSeoUrl(),
    image = `${imageUrl}logo.png`,
}) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
    );
};

export default Seo;
