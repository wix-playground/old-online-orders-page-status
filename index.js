#!/usr/bin/env node

const axios = require('axios');
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

// Fixed cookie header as provided
const COOKIE_HEADER = '_fire_console_csrf_token=coeuaJ_rGuJO7rnSIN5rN604aoucIEca5M96IBTCAtk; petri_ovr=specs.support.LessCapabilitiesForSupportUser#true; fs_uid=#11CC00#6021332793503744:3941445098482445350:::#/1778144530; WixBoAuthentication-wewix=eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3SXZRRVJmT1dOVGlGeHZnU2drVFlWblJ6Ulh5ZWQzVDNjV3FENjc1SVdBIn0.eyJleHAiOjE3NTY3Mjk1MDUsImlhdCI6MTc1NjY4NjMyMywiYXV0aF90aW1lIjoxNzU2Njg2MzA1LCJqdGkiOiI4YWVhNTU1OC1lYzE2LTRlMGYtYjdiNC0zNmE3NTU0N2IyMWUiLCJpc3MiOiJodHRwczovL3Nzby53ZXdpeC5uZXQvYXV0aC9yZWFsbXMvV0lYLUFQUCIsInN1YiI6ImY6MmRkZGUyZGQtNWIxOS00YTkyLWJjZDctYzA4NjZlZjIxMDhiOmxpcm9uYSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJvLXdld2l4Iiwic2Vzc2lvbl9zdGF0ZSI6IjJlNDBkYjBhLTcwMzctNDNiOS05NTExLWI1NDY4YzMzOGM1NCIsInNjb3BlIjoiRVJPIHByb2ZpbGUgb3BlbmlkIGVtYWlsIiwic2lkIjoiMmU0MGRiMGEtNzAzNy00M2I5LTk1MTEtYjU0NjhjMzM4YzU0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJMaXJvbiBBc2hhbWkiLCJlbXBsb3llZUlkIjoiMjI4ODczIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibGlyb25hIiwiZ2l2ZW5fbmFtZSI6Ikxpcm9uIiwiZmFtaWx5X25hbWUiOiJBc2hhbWkiLCJlbWFpbCI6Imxpcm9uYUB3aXguY29tIn0.pfnbOJ3SPwY2bLNlrczSBgtUTeuKhP1IJu4KaQJVpDXqi99GprLltNXMbje6kWMQQwVbdS4YzyWidFzLGAGK0UrTZU2Go8nRDqyK4jhD0WSr7Rvfw1p7ia3fT3ckCJTav1mWGhSE91zz_RmFGrwL-vnX3M336snbICiRIScDXQ8OEzEghrj4VGXTG_9ThcWPOjUuYltNtfo9c5uMKabAJs9c0HhggGeaOhRFN0dCxjYzkBSkKqI_KYrBBtmaErDHJ-ax2qElESNVYXkYmq-gemFABO6PDQPL2L4dTtYUdNNjmsy6OTn0lmu2ZhO9M9cpfjUs9xTzOUdy3YEZjTLycA; WixBoAuthentication_1_19_0=EvjwzHqQn6P99CqTqdtc81JLfN4HhCgQpR2zQT9+QGQ0sa2AZodpFyyrynuG6UXDK9FCSZY+Z6VcXRt0G56ugzSrDDPY50kGU+hjSBX11NKaqliPE/z7ViG6roWOWg58kG5n4P2vaDzozmjALbaMQBBYKzUdSgNNTpINpr8+LKG25FbedMXbM93TjcKJp/EtIWlyaskwWGSOdThVNMWxysNirDDXhWf/VpMQV73H1H8PSUp8l3eetJcA6k8nsAZgaB1TlExuDO+YIU7952saEaxdgGhUmeBhwdwT6xcw+Me5Lj/KPkB8aGpCglirDuU9DGRHqo3g5I0KmpFRO4nQLMaexJRB45ElwSAVXevwRk5reqf3trZl02Ux0EYXtz9pBSm7bpHockWAuDWqsh/n5Ogu/COA9MMOMhDPyC05eHtsVNCI+A1APkNeINxJFLP9ah0X1d8tSG3I1L56wrnAOyf/jDm61r5Q19s7Kq/dGO9P0INFuvQ9IOQc/XYryiExuA3h0/eVo+Gl/B5Ntyk/+/3z+gONJh9ltel+mMRu3UBiCZzHeulT/ci2dkD44VJNzyHOYRy1JMTDWDQOQ9nGUBOBEUHbTb8kn42olXmsK1g0WuQ2DyI3Psw+2Fg0/0WmGHQVjTM2Br2SUZTPFK+eXyFdPqF3M37cIBDhBT9T1tarM3X+9FXHeJE21iGlneSPJTYZqn0clQepd0LAb0Ybk1EKnHUtnjmbz2EOMycToQMIdQirP/ffjNzPTSl5Pm6p/hAo96BpIuu5Cj4YoHYXLIFNH9jKk5i6SA3ZMnhoOl3F3kUIZo+GKT0vIcAthswBnO+nW8X6vGoYyDrqY7a60rVQ/83LD3ybBO1/CCRrKV/SPFv7bC/cwPQl1ofALyoNVFdCU/vV1bzpIxbDTJ/zSm7oNDUE3GtYJLGmqKTcZnAp/eVbeVlXU54i7Ih3NSYpfjGh7htzB1wRy8KMOlUZ9B+KJw+7llSzJbC+mHWbX33NZF4DhCgLkDyUQuu1jBfEB1th+FGrqFhCDEdZZ45GS0gt+1WkAEOH7vFWZBpORIWovnzA8RKmMd5e9n2yvzsZiQZs94Fzd17ZfKh42OXHaBtag8KpTiknyj3K3UW144arD7dfqeE0tl78ZrtMCWFIw8v4e4ys83QKe/PNBvRGRjI6CATE/BKVe/THmIyypOetNSJotZcR7mxFs8a22TOEmOmFYM5B3CdWfhiyWiOUHh2Z1pv9eFM936NkzRUGM7of1pBbEZPlspT5yfY0ozRzhpw+FGUbntE6em6hTIY05ZEY53DPUFoc/X0pWTc+MAwEPm/FXMkbXfZOJBT3/Vh/UTk33O1LR7mhrhpqsLW5wu1dxlJNDqtA/+lSAqbc7FEK6niiDFMb5TsfmyKS8pciGWsBxyrVhOYtD/o+k73+9KaihQUTnZhg/7kFEk7BbVG6qExa27Th/saj5ZvjI27bc3Z4byLk/r4MXlLg7TipqbR4IQyzEstTJnAZ7ugtAM2TjN7F889sArp8PGUOjAlK61ANUY5iYyntVTd28L77DCnI3+jTDvehb92G60wAvnjNejR3+OX2LtNwjOzn2kpi7pv3ZWgxwd1QF+BEm8E90Rh/VZYOzNHrAfcJW7adP/JSKfavHS7N15mDHSjiy38O3nxQLxQLRqhYLIdCnLJD0oi2bSivlxg/5lBgOxq9HdQgY6B+LqDad85XIDKLwtn6/LZBMSaw32UkBQm8VG5XluTjS8Lgp0eN/lhvardU+AvefCm55feOp9Tj9tGjJXy1kp/Pc45eo6tUYzTyfXUDRTgBoARlB0xp35R/gx4vWfk=; wixSession2=JWT.eyJraWQiOiJrdU42YlJQRCIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1widXNlckd1aWRcIjpcIjYzM2MxNTlmLWQzNmQtNGFiMS1iODJjLTRlYzYyMWI4NTExYlwiLFwidXNlck5hbWVcIjpcImxpcm9uYTc5OVwiLFwiY29sb3JzXCI6e1wicG9zdFJlZ0NvbG9yXCI6W1wiZGV2ZWxvcGVyXCJdfSxcInVjZFwiOlwiMjAyMS0wOS0wMVQwODo0NzoyMy4wMDArMDA6MDBcIixcInd4c1wiOnRydWUsXCJld3hkXCI6dHJ1ZSxcImFvclwiOnRydWUsXCJhY2lcIjpcIjYzM2MxNTlmLWQzNmQtNGFiMS1iODJjLTRlYzYyMWI4NTExYlwiLFwicm1iXCI6ZmFsc2UsXCJsdmxkXCI6XCIyMDI1LTA5LTAxVDAwOjI1OjIzLjMyOSswMDowMFwiLFwibGF0aFwiOlwiMjAyNS0wOS0wMVQwMDoyNToyMy4zMjkrMDA6MDBcIixcInd4ZXhwXCI6XCIyMDI1LTA5LTAxVDAwOjU1OjIzLjM0MiswMDowMFwiLFwiaXVpXCI6XCI2MzNjMTU5Zi1kMzZkLTRhYjEtYjgyYy00ZWM2MjFiODUxMWJcIixcInBhY1wiOnRydWUsXCJhY2NkXCI6XCIyMDIxLTA5LTAxVDA4OjQ3OjIzLjAwMCswMDowMFwifSIsImlhdCI6MTc1NjY4NjMyMywiZXhwIjoxNzU2Njg4MTIzfQ.YYmeyOEKjiq2A5Ylg7C3eu_aWQ3U7QjHTVVsZtuB_1HRHSFCKHWokgaGXwWkAIy9gRq-TtzIOak7ys2gBrxDvE2zOckUwd5WYBef66v_uDF4NjbP76zyehOaWqEVdcmPo-ClY_iX8Y0ysOq3MpPlU9uN0oTvvPIdDwOJgonn0a4ievZGg9TOXLI463hIrx7tjj30fTjp-dBf8BLY-z-3igNuxGdFr9zx_eITq26j1Z06I0kGj7bewKBkAOUY5F58EI8mX5z6MA8eq6uKM7D0VVsiR5z4BTCac7D4vvw5YjZFHWlcIuuH4w665DmhkUKEmY9MsjNiS6RCjxXe90_xoA; XSRF-TOKEN=1756686399|Phryeu0e5lGb';

// App definition ID for restaurants
const APP_DEF_ID = '9a5d83fd-8570-482e-81ab-cfa88942ee60';

/**
 * Filter revisions based on published status and modification timestamp, return only first result
 */
function filterRevisions(response) {
  const cutoffDate = new Date('2025-08-25T00:00:00.000Z');
  
  if (response && response.responses && response.responses[0] && response.responses[0].message && response.responses[0].message.result) {
    const result = response.responses[0].message.result;
    
    if (result.revisions && Array.isArray(result.revisions)) {
      const filteredRevisions = result.revisions.filter(revision => {
        // Filter by published = true
        const isPublished = revision.published === true;
        
        // Filter by modificationTimestamp < 2025-08-25
        let isBeforeCutoff = true;
        if (revision.modificationTimestamp) {
          const modDate = new Date(revision.modificationTimestamp);
          isBeforeCutoff = modDate < cutoffDate;
        }
        
        return isPublished && isBeforeCutoff;
      });
      
      // Take only the first result
      const firstResult = filteredRevisions.length > 0 ? [filteredRevisions[0]] : [];
      
      // Update the response with filtered results
      const originalCount = result.revisions.length;
      result.revisions = firstResult;
      result.originalCount = originalCount;
      result.filteredCount = firstResult.length;
      result.selectedFilename = firstResult.length > 0 ? firstResult[0].filename : null;
    }
  }
  
  return response;
}

/**
 * Step 4: Fetch revision data and check for online-ordering page
 */
async function fetchRevisionData(filename, debug = false) {
  if (!filename) {
    throw new Error('No filename provided');
  }
  
  const url = `https://editor.wixstatic.com/revs/${filename}.z`;
  
  if (debug) {
    console.log('=== DEBUG: REVISION DATA REQUEST ===');
    console.log('URL:', url);
    console.log('=====================================\n');
  }
  
  try {
    const response = await axios.get(url);
    
    if (debug) {
      console.log('=== DEBUG: REVISION DATA RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Data length:', JSON.stringify(response.data).length, 'characters');
      console.log('======================================\n');
    }
    
    // Search for online-ordering page
    const data = response.data;
    let onlineOrderingPage = null;
    
    // Function to recursively search through the data structure
    function searchForOnlineOrdering(obj, path = '') {
      if (typeof obj !== 'object' || obj === null) {
        return null;
      }
      
      // Check if this object has pageUriSEO
      if (obj.pageUriSEO) {
        if (obj.pageUriSEO === 'online-ordering') {
          return { object: obj, path: path, exactMatch: true };
        } else if (obj.pageUriSEO.includes('online-ordering')) {
          return { object: obj, path: path, exactMatch: false };
        }
      }
      
      // Recursively search in arrays and objects
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          const result = searchForOnlineOrdering(obj[i], `${path}[${i}]`);
          if (result) return result;
        }
      } else {
        for (const [key, value] of Object.entries(obj)) {
          const result = searchForOnlineOrdering(value, path ? `${path}.${key}` : key);
          if (result) return result;
        }
      }
      
      return null;
    }
    
    onlineOrderingPage = searchForOnlineOrdering(data);
    
    if (onlineOrderingPage) {
      const isHidden = onlineOrderingPage.object.hidden === true;
      
      if (debug) {
        console.log('=== DEBUG: ONLINE ORDERING PAGE FOUND ===');
        console.log('Path:', onlineOrderingPage.path);
        console.log('Exact match:', onlineOrderingPage.exactMatch);
        console.log('pageUriSEO:', onlineOrderingPage.object.pageUriSEO);
        console.log('hidden:', onlineOrderingPage.object.hidden);
        console.log('==========================================\n');
      }
      
      return {
        found: true,
        exactMatch: onlineOrderingPage.exactMatch,
        pageUriSEO: onlineOrderingPage.object.pageUriSEO,
        hidden: isHidden,
        path: onlineOrderingPage.path,
        object: onlineOrderingPage.object
      };
    } else {
      if (debug) {
        console.log('=== DEBUG: ONLINE ORDERING PAGE NOT FOUND ===');
        console.log('No object with pageUriSEO containing "online-ordering" was found');
        console.log('==============================================\n');
      }
      
      return {
        found: false,
        exactMatch: false,
        pageUriSEO: null,
        hidden: null,
        path: null,
        object: null
      };
    }
    
  } catch (error) {
    console.error('Error fetching revision data:', error.message);
    throw error;
  }
}

/**
 * Logs request details when debug mode is enabled
 */
function logRequest(method, url, headers, data, debug) {
  if (!debug) return;
  
  console.log('\n=== DEBUG: REQUEST DETAILS ===');
  console.log(`Method: ${method}`);
  console.log(`URL: ${url}`);
  console.log('Headers:');
  Object.entries(headers).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  if (data) {
    console.log('Data:');
    console.log(JSON.stringify(data, null, 2));
  }
  console.log('==============================\n');
}

/**
 * Step 1: Get authentication header using serverSign endpoint
 */
async function getAuthHeader(msid, debug = false) {
  const url = `https://wix-bo.com/fire-console/serverSign?appDefId=${APP_DEF_ID}&metaSiteId=${msid}`;
  
  const headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'cookie': COOKIE_HEADER,
    'pragma': 'no-cache'
  };

  logRequest('GET', url, headers, null, debug);

  try {
    const response = await axios.get(url, { headers });
    
    if (debug) {
      console.log('=== DEBUG: AUTH RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Data:', JSON.stringify(response.data, null, 2));
      console.log('============================\n');
    }

    // Check if we got an HTML response instead of JSON (indicates auth failure)
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html')) {
      throw new Error('Authentication failed - cookies may have expired. Please update the cookies in the script.');
    }

    // Check if we have the expected signature property
    if (!response.data || typeof response.data !== 'object' || !response.data.signature) {
      throw new Error('Invalid response format - missing signature property');
    }

    return response.data;
  } catch (error) {
    console.error('Error getting auth header:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Step 2: Get site instance information using RelooseApi
 */
async function getSiteInstanceId(msid, authToken, debug = false) {
  const url = 'https://wix-bo.com/fire-console/invoke/?artifact=com.wixpress.metasite.reloose-server&service=com.wixpress.metasite.reloose.api.RelooseApi&method=Get&serviceType=grpc&timeBudget=30000';
  
  const headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9,he;q=0.8',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'cookie': COOKIE_HEADER,
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-fire-console-csrf-token': 'coeuaJ_rGuJO7rnSIN5rN604aoucIEca5M96IBTCAtk',
    'x-wix-client-artifact-id': 'fire-console-client',
    'referer': `https://wix-bo.com/fire-console?artifact=com.wixpress.metasite.reloose-server&service=com.wixpress.metasite.reloose.api.RelooseApi&method=Get&body=%7B%22meta_site_id%22%3A%22${msid}%22%7D`
  };

  const data = {
    "data": [{
      "meta_site_id": msid
    }],
    "metadata": [{
      "name": "Authorization",
      "value": authToken
    }],
    "experiments": {}
  };

  logRequest('POST', url, headers, data, debug);

  try {
    const response = await axios.post(url, data, { headers });
    
    if (debug) {
      console.log('=== DEBUG: RELOOSE RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Data:', JSON.stringify(response.data, null, 2));
      console.log('===============================\n');
    }

    // Find the HtmlWeb app instance_id
    let htmlWebInstanceId = null;
    if (response.data && response.data.responses && response.data.responses[0] && 
        response.data.responses[0].message && response.data.responses[0].message.context) {
      const context = response.data.responses[0].message.context;
      if (context.apps && Array.isArray(context.apps)) {
        const htmlWebApp = context.apps.find(app => app.app_def_id === 'HtmlWeb');
        if (htmlWebApp && htmlWebApp.instance_id) {
          htmlWebInstanceId = htmlWebApp.instance_id;
        }
      }
    }

    if (!htmlWebInstanceId) {
      throw new Error('HtmlWeb app instance_id not found in response');
    }

    return htmlWebInstanceId;
  } catch (error) {
    console.error('Error getting site instance ID:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Step 3: Get site revisions using the auth header and instance ID
 */
async function getSiteRevisions(instanceId, authToken, debug = false) {
  const url = 'https://wix-bo.com/fire-console/invoke/?artifact=com.wixpress.wix-html-editor-revisions-webapp&service=SiteRevisionsApi&method=listRevisions&serviceType=json-rpc&timeBudget=30000';
  
  const headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'cookie': COOKIE_HEADER,
    'origin': 'https://wix-bo.com',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://wix-bo.com/fire-console?artifact=com.wixpress.wix-html-editor-revisions-webapp&service=SiteRevisionsApi&method=listRevisions&body=%7B%7D',
    'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    'x-fire-console-csrf-token': 'coeuaJ_rGuJO7rnSIN5rN604aoucIEca5M96IBTCAtk',
    'x-wix-client-artifact-id': 'fire-console-client'
  };

  const data = {
    "data": [{
      "siteId": instanceId,
      "limit": 50,
      "offset": 0
    }],
    "metadata": [{
      "name": "Authorization",
      "value": authToken
    }],
    "experiments": {}
  };

  logRequest('POST', url, headers, data, debug);

  try {
    const response = await axios.post(url, data, { headers });
    
    if (debug) {
      console.log('=== DEBUG: REVISIONS RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Data:', JSON.stringify(response.data, null, 2));
      console.log('=================================\n');
    }

    // Apply filters to the response
    const filteredData = filterRevisions(response.data);
    
    if (debug) {
      console.log('=== DEBUG: FILTERED RESPONSE ===');
      console.log('Data:', JSON.stringify(filteredData, null, 2));
      console.log('================================\n');
    }

    return filteredData;
  } catch (error) {
    console.error('Error getting site revisions:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Read MSIDs from a text file
 */
function readMsidsFromFile(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    const content = fs.readFileSync(absolutePath, 'utf8');
    const msids = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#')); // Filter empty lines and comments
    
    return msids;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Process a single MSID
 */
async function processSingleMsid(msid, debug = false) {
  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing MSID: ${msid}`);
    console.log(`${'='.repeat(60)}`);
    
    // Step 1: Get authentication header
    console.log('Step 1: Getting authentication header...');
    const authResponse = await getAuthHeader(msid, debug);
    
    if (!authResponse || !authResponse.signature) {
      throw new Error('Failed to get authentication token');
    }
    
    console.log('✓ Authentication header obtained');
    
    // Step 2: Get HtmlWeb instance ID
    console.log('Step 2: Getting HtmlWeb instance ID...');
    const instanceId = await getSiteInstanceId(msid, authResponse.signature, debug);
    
    console.log(`✓ HtmlWeb instance ID obtained: ${instanceId}`);
    
    // Step 3: Get site revisions
    console.log('Step 3: Fetching site revisions...');
    const settingsResponse = await getSiteRevisions(instanceId, authResponse.signature, debug);
    
    console.log('✓ Site revisions retrieved');
    
    // Show filtering summary and get filename
    let selectedFilename = null;
    if (settingsResponse && settingsResponse.responses && settingsResponse.responses[0] && 
        settingsResponse.responses[0].message && settingsResponse.responses[0].message.result) {
      const result = settingsResponse.responses[0].message.result;
      if (result.originalCount !== undefined && result.filteredCount !== undefined) {
        console.log(`📊 Filtering: ${result.originalCount} total → ${result.filteredCount} filtered (published=true, modified<2025-08-25)`);
      }
      selectedFilename = result.selectedFilename;
    }
    
    // Step 4: Fetch revision data and check for online-ordering page
    if (selectedFilename) {
      console.log('Step 4: Fetching revision data and analyzing online-ordering page...');
      const revisionAnalysis = await fetchRevisionData(selectedFilename, debug);
      
      console.log('✓ Revision data analyzed');
      console.log('\n=== ONLINE ORDERING PAGE ANALYSIS ===');
      if (revisionAnalysis.found) {
        console.log(`🎯 Online ordering page found!`);
        console.log(`   - pageUriSEO: "${revisionAnalysis.pageUriSEO}"`);
        console.log(`   - Exact match: ${revisionAnalysis.exactMatch ? 'Yes' : 'No (contains "online-ordering")'}`);
        console.log(`   - Hidden: ${revisionAnalysis.hidden ? '🔒 YES' : '👁️ NO'}`);
        console.log(`   - Path: ${revisionAnalysis.path}`);
      } else {
        console.log('❌ No online ordering page found');
        console.log('   No object with pageUriSEO containing "online-ordering" was found');
      }
      
      return { 
        msid, 
        success: true, 
        data: settingsResponse, 
        filename: selectedFilename,
        onlineOrderingAnalysis: revisionAnalysis 
      };
    } else {
      console.log('⚠️ No revision found matching criteria - skipping revision data analysis');
      return { msid, success: true, data: settingsResponse, filename: null, onlineOrderingAnalysis: null };
    }
    
  } catch (error) {
    console.error(`❌ Failed to fetch configuration for MSID ${msid}:`, error.message);
    return { msid, success: false, error: error.message };
  }
}

/**
 * Generate HTML report from results
 */
function generateHtmlReport(results, outputPath = 'report.html') {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Online Ordering Pages Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1em;
        }
        .filters {
            padding: 20px 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
        }
        .filter-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .filter-group label {
            font-weight: 600;
            color: #495057;
            font-size: 0.9em;
        }
        .filter-group input, .filter-group select {
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .stats {
            padding: 20px 30px;
            background: #e3f2fd;
            display: flex;
            justify-content: space-around;
            text-align: center;
            flex-wrap: wrap;
            gap: 20px;
        }
        .stat {
            flex: 1;
            min-width: 120px;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #1976d2;
        }
        .stat-label {
            color: #666;
            font-size: 0.9em;
            margin-top: 5px;
        }
        .table-container {
            padding: 30px;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9em;
        }
        th {
            background: #f8f9fa;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            color: #495057;
            border-bottom: 2px solid #dee2e6;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
            vertical-align: top;
        }
        tr:hover {
            background-color: #f8f9fa;
        }
        .status-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-visible {
            background: #d4edda;
            color: #155724;
        }
        .status-hidden {
            background: #f8d7da;
            color: #721c24;
        }
        .status-not-found {
            background: #fff3cd;
            color: #856404;
        }
        .status-error {
            background: #f8d7da;
            color: #721c24;
        }
        .msid-cell {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.8em;
            background: #f8f9fa;
            padding: 8px;
            border-radius: 4px;
        }
        .filename-cell {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.8em;
            max-width: 200px;
            word-break: break-all;
        }
        .no-results {
            text-align: center;
            padding: 40px;
            color: #6c757d;
            font-style: italic;
        }
        .footer {
            padding: 20px 30px;
            background: #f8f9fa;
            text-align: center;
            color: #6c757d;
            font-size: 0.9em;
            border-top: 1px solid #e9ecef;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍕 Online Ordering Pages Report</h1>
            <p>Analysis of site revisions and online ordering page visibility</p>
        </div>
        
        <div class="filters">
            <div class="filter-group">
                <label for="msidFilter">MSID:</label>
                <input type="text" id="msidFilter" placeholder="Filter by MSID..." />
            </div>
            <div class="filter-group">
                <label for="hiddenFilter">Page Status:</label>
                <select id="hiddenFilter">
                    <option value="">All</option>
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                    <option value="not-found">Not Found</option>
                    <option value="error">Error</option>
                </select>
            </div>
            <div class="filter-group">
                <button onclick="clearFilters()" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Clear Filters</button>
            </div>
        </div>

        <div class="stats">
            <div class="stat">
                <div class="stat-number" id="totalCount">${results.length}</div>
                <div class="stat-label">Total Sites</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="visibleCount">${results.filter(r => r.success && r.onlineOrderingAnalysis?.found && !r.onlineOrderingAnalysis?.hidden).length}</div>
                <div class="stat-label">Visible Pages</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="hiddenCount">${results.filter(r => r.success && r.onlineOrderingAnalysis?.found && r.onlineOrderingAnalysis?.hidden).length}</div>
                <div class="stat-label">Hidden Pages</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="notFoundCount">${results.filter(r => r.success && r.onlineOrderingAnalysis && !r.onlineOrderingAnalysis?.found).length}</div>
                <div class="stat-label">Not Found</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="errorCount">${results.filter(r => !r.success).length}</div>
                <div class="stat-label">Errors</div>
            </div>
        </div>

        <div class="table-container">
            <table id="resultsTable">
                <thead>
                    <tr>
                        <th>MSID</th>
                        <th>Site ID</th>
                        <th>Filename</th>
                        <th>Page URI SEO</th>
                        <th>Page Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(result => {
                        const siteId = result.data?.responses?.[0]?.message?.result?.revisions?.[0]?.siteId || 'N/A';
                        const filename = result.filename || 'N/A';
                        const pageUriSEO = result.onlineOrderingAnalysis?.pageUriSEO || 'N/A';
                        
                        let statusClass, statusText;
                        if (!result.success) {
                            statusClass = 'status-error';
                            statusText = 'Error';
                        } else if (!result.onlineOrderingAnalysis) {
                            statusClass = 'status-error';
                            statusText = 'No Analysis';
                        } else if (!result.onlineOrderingAnalysis.found) {
                            statusClass = 'status-not-found';
                            statusText = 'Not Found';
                        } else if (result.onlineOrderingAnalysis.hidden) {
                            statusClass = 'status-hidden';
                            statusText = 'Hidden';
                        } else {
                            statusClass = 'status-visible';
                            statusText = 'Visible';
                        }
                        
                        return `
                        <tr data-msid="${result.msid}" data-status="${statusText.toLowerCase().replace(' ', '-')}">
                            <td><div class="msid-cell">${result.msid}</div></td>
                            <td><div class="msid-cell">${siteId}</div></td>
                            <td><div class="filename-cell">${filename}</div></td>
                            <td>${pageUriSEO}</td>
                            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <div class="footer">
            Generated on ${new Date().toLocaleString()} | Total: ${results.length} sites analyzed
        </div>
    </div>

    <script>
        function filterTable() {
            const msidFilter = document.getElementById('msidFilter').value.toLowerCase();
            const hiddenFilter = document.getElementById('hiddenFilter').value;
            const rows = document.querySelectorAll('#resultsTable tbody tr');
            
            let visibleCount = 0;
            
            rows.forEach(row => {
                const msid = row.dataset.msid.toLowerCase();
                const status = row.dataset.status;
                
                const msidMatch = !msidFilter || msid.includes(msidFilter);
                const statusMatch = !hiddenFilter || status === hiddenFilter;
                
                if (msidMatch && statusMatch) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Update stats for filtered results
            updateFilteredStats(visibleCount);
        }
        
        function updateFilteredStats(visibleCount) {
            const visibleRows = Array.from(document.querySelectorAll('#resultsTable tbody tr')).filter(row => row.style.display !== 'none');
            
            const stats = {
                total: visibleRows.length,
                visible: visibleRows.filter(row => row.dataset.status === 'visible').length,
                hidden: visibleRows.filter(row => row.dataset.status === 'hidden').length,
                notFound: visibleRows.filter(row => row.dataset.status === 'not-found').length,
                error: visibleRows.filter(row => row.dataset.status === 'error' || row.dataset.status === 'no-analysis').length
            };
            
            document.getElementById('totalCount').textContent = stats.total;
            document.getElementById('visibleCount').textContent = stats.visible;
            document.getElementById('hiddenCount').textContent = stats.hidden;
            document.getElementById('notFoundCount').textContent = stats.notFound;
            document.getElementById('errorCount').textContent = stats.error;
        }
        
        function clearFilters() {
            document.getElementById('msidFilter').value = '';
            document.getElementById('hiddenFilter').value = '';
            filterTable();
        }
        
        // Add event listeners
        document.getElementById('msidFilter').addEventListener('input', filterTable);
        document.getElementById('hiddenFilter').addEventListener('change', filterTable);
        
        // Initialize
        filterTable();
    </script>
</body>
</html>`;

  fs.writeFileSync(outputPath, htmlContent);
  console.log(`\n📊 HTML report generated: ${outputPath}`);
  return outputPath;
}

/**
 * Process multiple MSIDs from file
 */
async function processMultipleMsids(filePath, debug = false) {
  const msids = readMsidsFromFile(filePath);
  
  if (msids.length === 0) {
    console.log('No valid MSIDs found in the file.');
    return;
  }
  
  console.log(`Found ${msids.length} MSIDs to process from file: ${filePath}`);
  
  const results = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < msids.length; i++) {
    const msid = msids[i];
    console.log(`\n[${i + 1}/${msids.length}] Processing: ${msid}`);
    
    const result = await processSingleMsid(msid, debug);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Add a small delay between requests to be respectful to the API
    if (i < msids.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('BATCH PROCESSING SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`Total processed: ${msids.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  
  if (errorCount > 0) {
    console.log('\nFailed MSIDs:');
    results
      .filter(r => !r.success)
      .forEach(r => console.log(`  - ${r.msid}: ${r.error}`));
  }
  
  return results;
}

/**
 * Main function to orchestrate the flow
 */
async function fetchRestaurantConfig(input, debug = false, isFile = false, generateReport = false) {
  let results = [];
  
  if (isFile) {
    results = await processMultipleMsids(input, debug);
    
    // Generate HTML report if requested
    if (generateReport && results.length > 0) {
      const reportPath = `report-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.html`;
      generateHtmlReport(results, reportPath);
    }
  } else {
    const result = await processSingleMsid(input, debug);
    results = [result];
    
    // Generate HTML report for single MSID if requested
    if (generateReport) {
      const reportPath = `report-${input}-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.html`;
      generateHtmlReport(results, reportPath);
    }
  }
}

// CLI setup
program
  .name('restaurant-config')
  .description('CLI tool to fetch site revisions information via HtmlWeb instance ID')
  .version('1.0.0')
  .argument('<input>', 'Meta Site ID or path to text file containing multiple MSIDs')
  .option('-f, --file', 'Treat input as a file path containing multiple MSIDs (one per line)')
  .option('-d, --debug', 'Enable debug mode to print request details with headers')
  .option('-r, --report', 'Generate HTML report with results summary and filtering')
  .action(async (input, options) => {
    await fetchRestaurantConfig(input, options.debug, options.file, options.report);
  });

program.parse();