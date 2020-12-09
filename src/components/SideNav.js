import React from 'react';
import { Link } from 'gatsby';
import {
  PageSidebar,
  Nav,
  NavList,
  NavExpandable,
  NavItem
} from '@patternfly/react-core';
import { Location } from '@reach/router';
import PropTypes from 'prop-types';

const SideNav = ({ sideNav }) => (
  <Location>
    {({ location }) => {
      const normalizePath = path => {
        let normalizedPath = path.endsWith('/') ? path : `${path}/`;
        normalizedPath = normalizedPath.startsWith('/') ? normalizedPath : `/${path}`;
        return normalizedPath;
      };
      const currentPath = normalizePath(location.pathname);

      const isActiveTest = path => {
        const pathWithSlash = normalizePath(path);
        const currentPathWithSlash = normalizePath(currentPath);
        return currentPathWithSlash.endsWith(pathWithSlash);
      };

      const isActiveTestGroup = pages => {
        for (let page of pages) {
          if (isActiveTest(page.path)) {
            return true;
          }
        }
        return false;
      };

      // expandable nav groups
      const renderNavGroups = () =>
        sideNav.map(item => {
          if (!item.pages) {
            return (
              <NavItem itemId={item.path} key={item.path} isActive={isActiveTest(item.path)}>
                <Link to={item.path}>{item.title}</Link>
              </NavItem>
            );
          }
          return (
            <NavExpandable
              title={item.title}
              groupId={item.title}
              key={item.title}
              isActive={isActiveTestGroup(item.pages)}
              isExpanded={isActiveTestGroup(item.pages)}
            >
              {renderNavItems(item.title, item.pages)}
            </NavExpandable>
          );
        });

      const renderNavItems = (group, pages) =>
        pages.map(page => (
          <NavItem groupId={group} itemId={page.path} key={page.path} isActive={isActiveTest(page.path)}>
            <Link to={page.path}>{page.title}</Link>
          </NavItem>
        ));

      const PageNav = (
        <Nav aria-label="Side Nav">
          <NavList>
            {renderNavGroups()}
          </NavList>
        </Nav>
      );

      return (
        <PageSidebar nav={PageNav} />
      );
    }}
  </Location>
);

SideNav.propTypes = {
  sideNav: PropTypes.any
};

export default SideNav;