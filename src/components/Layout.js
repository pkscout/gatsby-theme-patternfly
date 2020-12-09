import React, { useState } from 'react';
import { Page } from '@patternfly/react-core';
import SideNav from './SideNav';
import Header from './Header';
// import Breadcrumb from './Breadcrumb';
import SkipToContent from './SkipToContent';
import MDXProvider from './MDXProvider';
import PropTypes from 'prop-types';
import { graphql, useStaticQuery } from 'gatsby';
import { Location } from '@reach/router';

const Layout = ({ children }) => {
  const [deviceView, setDeviceView] = useState(false);
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          useTopNav
          useSideNav
          mainContainerId
          sideNav {
            rootPath
            nav {
              title
              path
              pages {
                path
                title
              }
            }
          }
          topNav {
            title
            rootPath
            path
          }
        }
      }
    }
  `);
  const { useTopNav, useSideNav, mainContainerId, topNav, sideNav } = data.site.siteMetadata;

  return (
    <Location>
      {({ location }) => {
        const normalizePath = path => {
          let normalizedPath = path.endsWith('/') ? path : `${path}/`;
          normalizedPath = normalizedPath.startsWith('/') ? normalizedPath : `/${path}`;
          return normalizedPath;
        };
        const currentPath = normalizePath(location.pathname);
        const allNavs = sideNav;
        const matchingNav = allNavs.filter(navContainer => {
          // search the container if it includes the current path
          // if it does then this side nav is a match for the current page
          if (currentPath.startsWith(navContainer.rootPath)) {
            return true;
          }
          for (let nav of navContainer.nav) {
            if (nav.path && normalizePath(nav.path) === currentPath) {
              return true;
            }
            if (nav.pages) {
              for (let page of nav.pages) {
                if (normalizePath(page.path) === currentPath) {
                  return true;
                }
              }
            }
          }
          return false;
        });
        const navItems = (matchingNav && matchingNav.length) ? matchingNav[0].nav : null;

        const onPageResize = ({ mobileView }) => {
          if (mobileView !== deviceView) {
            setDeviceView(mobileView);
          }
        };

        return (
          <Page
            isManagedSidebar
            onPageResize={onPageResize}
            header={<Header useTopNav={useTopNav} topNav={topNav} showNavToggle={navItems !== null && deviceView} />}
            sidebar={useSideNav && navItems ? <SideNav sideNav={navItems} /> : null}
            skipToContent={<SkipToContent mainContainerId={mainContainerId} />}
            mainContainerId={mainContainerId}
            // breadcrumb={<Breadcrumb />}
            style={{ height: '100vh' }}
          >
            <MDXProvider>{children}</MDXProvider>
          </Page>
        );
      }}
    </Location>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
